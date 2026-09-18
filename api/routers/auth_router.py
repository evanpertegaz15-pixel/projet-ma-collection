from core.security import hash_password
from dependencies.db import get_session
from fastapi import APIRouter, Depends, HTTPException, status
from api.models.user_model import User
from api.schemas.auth_schema import RegisterRequest, UserPublic
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter()

@router.post("/auth/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, session: AsyncSession = Depends(get_session)):
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