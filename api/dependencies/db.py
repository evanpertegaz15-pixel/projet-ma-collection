from db.init_db import async_session
from sqlmodel.ext.asyncio.session import AsyncSession

async def get_session():
    async with async_session() as session:
        yield session