from datetime import datetime
from pydantic import BaseModel, Field
from schemas.item_schema import ItemPublic
from typing import Literal

EntryType = Literal["a_decouvrir", "en_cours", "termine"]

class EntryPublic(BaseModel):
    id: int
    statut: EntryType
    note: int | None
    commentaire: str | None
    date_ajout: datetime
    item: ItemPublic

class EntryCreate(BaseModel):
    item_id: int
    statut: EntryType
    note: int | None = Field(default=None, ge=1, le=5)
    commentaire: str | None = None

class EntryUpdate(BaseModel):
    statut: EntryType | None = None
    note: int | None = Field(default=None, ge=1, le=5)
    commentaire: str | None = None

class EntryStats(BaseModel):
    total: int
    par_statut: dict[str, int]
    note_moyenne: float | None