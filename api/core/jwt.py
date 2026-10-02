import jwt
import logging
from core.config import settings
from dependencies.db import get_session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models.user_model import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

logger = logging.getLogger(__name__)

async def get_current_user(token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_session)) -> User :
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        logger.warning("JWT signature expired.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expiré.")
    except jwt.InvalidTokenError:
        logger.error("JWT token invalid.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide.")
    user_id = payload.get("sub")
    if not user_id:
        logger.warning("Unauthorized user.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide.")
    result = await session.exec(select(User).where(User.id == int(user_id)))
    user = result.first()
    if not user:
        logger.warning("User not found.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur introuvable.")
    logger.info(f"JWT generated for user {user.id}")
    return user