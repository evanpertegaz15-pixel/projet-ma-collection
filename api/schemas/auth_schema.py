from pydantic import BaseModel

#User input
class RegisterRequest(BaseModel):
    email: str
    password: str

#Server render
class UserPublic(BaseModel):
    id: int
    email: str