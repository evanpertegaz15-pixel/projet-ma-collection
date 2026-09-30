import logging
from core.jwt import get_current_user
from dependencies.db import get_session
from fastapi import APIRouter, Depends, HTTPException, status
from models.entry_model import Entry
from models.item_model import Item
from models.user_model import User
from schemas.entry_schema import EntryCreate, EntryPublic, EntryUpdate, EntryStats, EntryType
from schemas.item_schema import ItemPublic
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

collection_router = APIRouter()

logger = logging.getLogger(__name__)

@collection_router.get("/me/collection", response_model=list[EntryPublic], status_code=status.HTTP_200_OK, summary="Renvoie la collection de l'utilisateur actif.")
async def get_collection(statut: EntryType | None = None, tri: str | None = None, session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
    logger.info(f"GET /me/collection")
    query = select(Entry).where(Entry.user_id == user.id)
    if statut:
        query = query.where(Entry.statut == statut)
    if tri == "date":
        query = query.order_by(Entry.date_ajout.desc())
    elif tri == "note":
        query = query.order_by(Entry.note.desc())
    results = await session.exec(query)
    entries = results.all()
    response = []
    for entry in entries:
        item = await session.get(Item, entry.item_id)
        response.append(EntryPublic(
            id=entry.id,
            statut=entry.statut,
            note=entry.note,
            commentaire=entry.commentaire,
            date_ajout=entry.date_ajout,
            item=ItemPublic(**item.model_dump())
        ))
    logger.info(f"Collection returned.")
    return response

@collection_router.post("/me/collection", response_model=EntryPublic, status_code=status.HTTP_201_CREATED, summary="Ajoute un item dans la collection de l'utilisateur.")
async def add_item(data:EntryCreate, session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
    logger.info(f"POST /me/collection")
    item = await session.get(Item, data.item_id)
    if not item:
        logger.warning(f"Item not found.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item inexistant.")
    query = select(Entry).where(Entry.user_id == user.id, Entry.item_id == data.item_id)
    existing = await session.exec(query)
    if existing.first():
        logger.warning(f"Item already in collection.")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Item déjà présent.")
    entry = Entry(
        user_id=user.id,
        item_id=data.item_id,
        statut=data.statut,
        note=data.note,
        commentaire=data.commentaire
    )
    session.add(entry)
    await session.commit()
    await session.refresh(entry)
    logger.info(f"Item successfully added to the collection.")
    return EntryPublic(
        id=entry.id,
        statut=entry.statut,
        note=entry.note,
        commentaire=entry.commentaire,
        date_ajout=entry.date_ajout,
        item=ItemPublic(**item.model_dump())
    )

@collection_router.patch("/me/collection/{entry_id}", response_model=EntryPublic, status_code=status.HTTP_200_OK, summary="Met à jour un item de la collection.")
async def update_item(entry_id: int, data: EntryUpdate, session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
    logger.info(f"PATCH /me/collection/{entry_id}")
    entry = await session.get(Entry, entry_id)
    if not entry or entry.user_id != user.id:
        logger.warning(f"Item with id {entry_id} not found.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entrée inexistante.")
    if "statut" in data.model_fields_set and data.statut is not None:
        entry.statut = data.statut
    if "note" in data.model_fields_set:
        entry.note = data.note
    if "commentaire" in data.model_fields_set:
        entry.commentaire = data.commentaire
    session.add(entry)
    await session.commit()
    await session.refresh(entry)
    item = await session.get(Item, entry.item_id)
    logger.info(f"Item successfully updated.")
    return EntryPublic(
        id=entry.id,
        statut=entry.statut,
        note=entry.note,
        commentaire=entry.commentaire,
        date_ajout=entry.date_ajout,
        item=ItemPublic(**item.model_dump())
    )
    

@collection_router.delete("/me/collection/{entry_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Supprime un item de la collection.")
async def delete_item(entry_id: int, session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
    logger.info(f"DELETE /me/collection/{entry_id}")
    entry = await session.get(Entry, entry_id)
    if not entry or entry.user_id != user.id:
        logger.warning(f"Item with id {entry_id} not found.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entrée inexistante.")
    await session.delete(entry)
    await session.commit()
    logger.info(f"Item successfully deleted.")
    return

@collection_router.get("/me/stats", response_model=EntryStats, status_code=status.HTTP_200_OK, summary="Renvoie les statistiques de la collection.")
async def get_stats(session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
    logger.info(f"GET /me/stats")
    query = select(Entry).where(Entry.user_id == user.id)
    results = await session.exec(query)
    entries = results.all()
    total = len(entries)
    par_statut: dict[str, int] = {}
    notes = []
    for entry in entries:
        par_statut[entry.statut] = par_statut.get(entry.statut, 0) + 1
        if entry.note is not None:
            notes.append(entry.note)
    note_moyenne = sum(notes) / len(notes) if notes else None
    logger.info(f"Stats returned : total = {total} ; par statut = {par_statut} ; note moyenne = {note_moyenne}")
    return {"total": total, "par_statut": par_statut, "note_moyenne": note_moyenne}