from sqlmodel import SQLModel, Field

#Item in the database
class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(min_length=2, max_length=50)
    categorie: str = Field(max_length=30)
    description: str = Field(min_length=10, max_length=200)
    image_url: str = Field(max_length=150)
    year: int = Field(ge=1800, lt=1900)
    item_range: int = Field(ge=0)