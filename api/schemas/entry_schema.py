from datetime import datetime
from pydantic import BaseModel
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