from contextlib import asynccontextmanager
from db.init_db import init_db
from fastapi import FastAPI
from routers.auth_router import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield #Before yield -> exe on startup | After -> exe on stop

app = FastAPI(title="Collection XIXème siècle", version="0.1", lifespan=lifespan)
app.include_router(router)