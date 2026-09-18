from sqlmodel import SQLModel, Field

#User in the database
class User(SQLModel, table=True):
    id: int | None = Field(default= None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hash_password: str