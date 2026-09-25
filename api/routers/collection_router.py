from core.jwt import get_current_user
from dependencies.db import get_session
from fastapi import APIRouter, Depends, HTTPException, status
from models.entry_model import Entry
from models.item_model import Item
from models.user_model import User
from schemas.entry_schema import EntryCreate, EntryPublic, EntryUpdate, EntryType
from schemas.item_schema import ItemPublic
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

collection_router = APIRouter()

@collection_router.get("/me/collection", response_model=list[EntryPublic], status_code=status.HTTP_200_OK)
async def get_collection(statut: EntryType | None = None, tri: str | None = None, session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
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
    return response

@collection_router.post("/me/collection", response_model=EntryPublic, status_code=status.HTTP_201_CREATED)
async def add_item(data:EntryCreate, session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
    item = await session.get(Item, data.item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item inexistant.")
    query = select(Entry).where(Entry.user_id == user.id, Entry.item_id == data.item_id)
    existing = await session.exec(query)
    if existing.first():
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
    return EntryPublic(
        id=entry.id,
        statut=entry.statut,
        note=entry.note,
        commentaire=entry.commentaire,
        date_ajout=entry.date_ajout,
        item=ItemPublic(**item.model_dump())
    )

@collection_router.patch("/me/collection/{entry_id}", response_model=EntryPublic, status_code=status.HTTP_200_OK)
async def update_item(entry_id: int, data: EntryUpdate, session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
    entry = await session.get(Entry, entry_id)
    if not entry or entry.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entrée inexistante.")
    if data.statut is not None:
        entry.statut = data.statut
    if data.note is not None:
        entry.note = data.note
    if data.commentaire is not None:
        entry.commentaire = data.commentaire
    session.add(entry)
    await session.commit()
    await session.refresh(entry)
    item = await session.get(Item, entry.item_id)
    return EntryPublic(
        id=entry.id,
        statut=entry.statut,
        note=entry.note,
        commentaire=entry.commentaire,
        date_ajout=entry.date_ajout,
        item=ItemPublic(**item.model_dump())
    )
    

@collection_router.delete("/me/collection/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(entry_id: int, session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
    entry = await session.get(Entry, entry_id)
    if not entry or entry.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entrée inexistante.")
    await session.delete(entry)
    await session.commit()
    return

@collection_router.get("/me/stats", status_code=status.HTTP_200_OK)
async def get_stats(session: AsyncSession = Depends(get_session), user: User = Depends(get_current_user)):
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
    return {"total": total, "par_statut": par_statut, "note_moyenne": note_moyenne}