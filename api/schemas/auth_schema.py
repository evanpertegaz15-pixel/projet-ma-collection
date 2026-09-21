from pydantic import BaseModel

#User input
class RegisterRequest(BaseModel):
    email: str
    password: str
    confirm_password: str

class LoginRequest(BaseModel):
    email: str
    password: str

#Server render
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"