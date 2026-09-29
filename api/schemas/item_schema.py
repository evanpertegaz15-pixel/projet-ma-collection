from pydantic import BaseModel
from typing import Literal

ItemType = Literal["artillery", "explosive", "firearm", "melee", "naval", "support"]

class ItemPublic(BaseModel):
    id: int
    name: str
    categorie: ItemType
    description: str
    image_url: str
    year: int
    item_range: int

class ItemList(BaseModel):
    total: int
    page: int
    limit: int
    results: list[ItemPublic]