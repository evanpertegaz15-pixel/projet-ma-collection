from datetime import datetime, timezone
from schemas.entry_schema import EntryType
from sqlmodel import SQLModel, Field

class Entry(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    item_id: int = Field(foreign_key="item.id")
    statut: EntryType
    note: int | None = Field(default=None, ge=0, lt=10)
    commentaire: str | None = Field(default=None, max_length=200)
    date_ajout: datetime = Field(default_factory=datetime.now(timezone.utc))