from dependencies.db import get_session
from fastapi import APIRouter, Depends, HTTPException, Query, status
from models.item_model import Item
from schemas.item_schema import ItemPublic, ItemType
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

items_router = APIRouter()

@items_router.get("/items", status_code=status.HTTP_200_OK)
async def list_items(q: str | None = None, categorie: ItemType | None = None, page: int = Query(1, ge=1), limit: int = Query(12, ge=1, le=50), session: AsyncSession = Depends(get_session)):
    query = select(Item) # SELECT * FROM item
    if q:
        query = query.where(Item.name.contains(q)) # WHERE name LIKE %q%
    if categorie:
        query = query.where(Item.categorie == categorie) # AND categorie = categorie
    total = (await session.exec(query)).count() # SELECT COUNT(q)
    query = query.offset((page - 1) * limit).limit(limit) #items from offset to limit -> 1-12 ; 13-24 ; 25-36, etc.
    items = (await session.exec(query)).all()
    return {"total": total, "page": page, "limit": limit, "results": items}

@items_router.get("/items/{item_id}", response_model=ItemPublic, status_code=status.HTTP_200_OK)
async def get_item(item_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.exec(select(Item).where(Item.id == item_id))
    item = result.first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item introuvable.")
    return item