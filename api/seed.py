import asyncio
from core.security import hash_password
from db.init_db import engine, async_session
from models.user_model import User
from sqlmodel import SQLModel

async def create_db():
    print("Initialisation des tables...")
    async with engine.begin() as conn: #Connect to db and close auto
        await conn.run_sync(SQLModel.metadata.create_all) #metadata -> all tables
    print("Peuplement de la base...")
    admin = User(email="admin@example.com", hash_password=hash_password("admin"))
    async with async_session() as session: #Open db session
        session.add(admin)
        await session.commit()
    print("Base initialisée.")

if __name__ == "__main__":
    asyncio.run(create_db())