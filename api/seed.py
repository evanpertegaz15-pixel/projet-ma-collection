import asyncio
from core.security import hash_password
from db.init_db import engine, async_session
from models.item_model import Item
from models.user_model import User
from seed_items.artillery import ARTILLERY_ITEMS
from seed_items.explosives import EXPLOSIVES_ITEMS
from seed_items.firearms import FIREARMS_ITEMS
from seed_items.melee import MELEE_ITEMS
from seed_items.naval import NAVAL_ITEMS
from seed_items.support import SUPPORT_ITEMS
from sqlmodel import select, SQLModel

ITEMS = ARTILLERY_ITEMS + EXPLOSIVES_ITEMS + FIREARMS_ITEMS + MELEE_ITEMS + NAVAL_ITEMS + SUPPORT_ITEMS

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