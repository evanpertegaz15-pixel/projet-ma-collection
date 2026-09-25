from core.jwt import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from models.user_model import User

collection_router = APIRouter()

@collection_router.get("/me/collection", status_code=status.HTTP_200_OK)
async def get_collection(user: User = Depends(get_current_user)):
    pass

@collection_router.post("/me/collection", status_code=status.HTTP_201_CREATED)
async def add_item(user: User = Depends(get_current_user)):
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item inexistant.")
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Item déjà présent.")

@collection_router.patch("/me/collection/{entry_id}", status_code=status.HTTP_200_OK)
async def update_item(user: User = Depends(get_current_user)):
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item inexistant.")

@collection_router.delete("/me/collection/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(user: User = Depends(get_current_user)):
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item inexistant.")

@collection_router.get("/me/stats", status_code=status.HTTP_200_OK)
async def get_stats(user: User = Depends(get_current_user)):
    pass