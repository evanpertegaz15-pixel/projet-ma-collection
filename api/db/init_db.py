from core.config import settings
from sqlalchemy import text
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = settings.DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=False)

async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        date_type = await conn.scalar(text(
            "SELECT data_type FROM information_schema.columns "
            "WHERE table_schema = current_schema() "
            "AND table_name = 'entry' AND column_name = 'date_ajout'"
        ))
        if date_type == "timestamp without time zone":
            await conn.execute(text(
                "ALTER TABLE entry ALTER COLUMN date_ajout "
                "TYPE TIMESTAMP WITH TIME ZONE "
                "USING date_ajout AT TIME ZONE 'UTC'"
            ))
