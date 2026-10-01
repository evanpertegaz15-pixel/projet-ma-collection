import logging
from dependencies.db import get_session
from fastapi import APIRouter, Depends, HTTPException, Query, status
from models.item_model import Item
from schemas.item_schema import ItemPublic, ItemList, ItemType
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

items_router = APIRouter()

logger = logging.getLogger(__name__)

@items_router.get("/items", response_model=ItemList, status_code=status.HTTP_200_OK, summary="Renvoie la liste des items.")
async def list_items(q: str | None = None, categorie: ItemType | None = None, page: int = Query(1, ge=1), limit: int = Query(12, ge=1, le=50), session: AsyncSession = Depends(get_session)) -> dict:
    logger.info(f"GET /items")
    query = select(Item) # SELECT * FROM item
    if q:
        query = query.where(Item.name.ilike(f"%{q}%")) # Case-insensitive
    if categorie:
        query = query.where(Item.categorie == categorie) # AND categorie = categorie
    total_query = select(func.count()).select_from(query.subquery())
    total = (await session.exec(total_query)).one()
    query = query.offset((page - 1) * limit).limit(limit) #items from offset to limit -> 1-12 ; 13-24 ; 25-36, etc.
    items = (await session.exec(query)).all()
    logger.info(f"Items returned : total = {total} ; page = {page} ; limit = {limit}")
    return {"total": total, "page": page, "limit": limit, "results": items}

@items_router.get("/items/{item_id}", response_model=ItemPublic, status_code=status.HTTP_200_OK, summary="Renvoie l'item spécifique à cet identifiant.")
async def get_item(item_id: int, session: AsyncSession = Depends(get_session)) -> Item:
    logger.info(f"GET /items/{item_id}")
    result = await session.exec(select(Item).where(Item.id == item_id))
    item = result.first()
    if not item:
        logger.warning(f"Item not found.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item introuvable.")
    logger.info(f"Item returned.")
    return item