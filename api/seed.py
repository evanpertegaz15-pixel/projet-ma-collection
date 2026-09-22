import asyncio
from core.security import hash_password
from db.init_db import engine, async_session
from models.item_model import Item
from models.user_model import User
from sqlmodel import select, SQLModel

ITEMS = []

async def create_db():
    print("Initialisation des tables...")
    async with engine.begin() as conn: #Connect to db and close auto
        await conn.run_sync(SQLModel.metadata.create_all) #metadata -> all tables
    print("Peuplement de la base...")
    async with async_session() as session: #Open db session
        for data in ITEMS:
            result = await session.exec(select(Item).where(Item.name == data["name"]))
            existing = result.first()
            if existing:
                print(f"Ignoré : {data['name']} ; item déjà présent.")
                continue
            item = Item(**data)
            session.add(item)
            print(f"Ajouté : {data['name']}")
        await session.commit()
    print("Base initialisée.")

if __name__ == "__main__":
    asyncio.run(create_db())