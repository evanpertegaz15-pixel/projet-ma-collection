import jwt
import logging
from core.jwt import get_current_user
from core.security import hash_password, verify_password
from datetime import datetime, timedelta, timezone
from dependencies.db import get_session
from fastapi import APIRouter, Depends, HTTPException, status
from models.user_model import User
from schemas.auth_schema import RegisterRequest, LoginRequest, TokenResponse
from schemas.user_schema import UserPublic
from core.config import settings
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

auth_router = APIRouter()

logger = logging.getLogger(__name__)

@auth_router.post("/auth/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED, summary="Permet à un utilisateur de créer un compte.")
async def register(data: RegisterRequest, session: AsyncSession = Depends(get_session)) -> User:
    logger.info(f"POST /auth/register")
    if data.password != data.confirm_password:
        logger.warning(f"Passwords are different.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Les mots de passe ne correspondent pas.")
    result = await session.exec(select(User).where(User.email == data.email))
    existing = result.first()
    if existing:
        logger.warning(f"Email {data.email} is already in use.")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email déjà utilisé.")
    hash = hash_password(data.password)
    user = User(email=data.email, hash_password=hash)
    session.add(user) #Init session
    await session.commit() #Writing db
    await session.refresh(user) #Fetching db
    logger.info(f"User successfully registered in the database.")
    return user

@auth_router.post("/auth/login", response_model=TokenResponse, status_code=status.HTTP_200_OK, summary="Permet à un utilisateur de se connecter à son compte.")
async def login(data: LoginRequest, session: AsyncSession = Depends(get_session)) -> dict:
    logger.info(f"POST /auth/login")
    result = await session.exec(select(User).where(User.email == data.email))
    user = result.first()
    if not user:
        logger.warning(f"Email {data.email} is invalid.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides.")
    if not verify_password(data.password, user.hash_password):
        logger.warning(f"Password is invalid.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Mot de passe invalide.")
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=2)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    logger.info(f"Token successfully created.")
    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/auth/me", response_model=UserPublic, status_code=status.HTTP_200_OK, summary="Renvoie l'utilisateur actif.")
async def me(user: User = Depends(get_current_user)) -> User:
    logger.info(f"GET /auth/me")
    return user