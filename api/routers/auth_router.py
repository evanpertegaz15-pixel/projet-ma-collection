import jwt
from core.security import hash_password, verify_password
from datetime import datetime, timedelta, timezone
from dependencies.db import get_session
from fastapi import APIRouter, Depends, HTTPException, status
from api.models.user_model import User
from api.schemas.auth_schema import RegisterRequest, UserPublic
from core.config import settings
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter()

@router.post("/auth/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, session: AsyncSession = Depends(get_session)):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Les mots de passe ne correspondent pas.")
    result = await session.exec(select(User).where(User.email == data.email))
    existing = result.first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email déjà utilisé.")
    hash = hash_password(data.password)
    user = User(email=data.email, hash_password=hash)
    session.add(user) #Init session
    await session.commit() #Writing db
    await session.refresh(user) #Fetching db
    return user

@router.post("/auth/login", response_model=UserPublic, status_code=status.HTTP_200_OK)
async def login(data: RegisterRequest, session: AsyncSession = Depends(get_session)):
    result = await session.exec(select(User).where(User.email == data.email))
    user = result.first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides.")
    if not verify_password(data.password, user.hash_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Mot de passe invalide.")
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=2)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}