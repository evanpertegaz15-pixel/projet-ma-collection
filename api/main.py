from contextlib import asynccontextmanager
from db.init_db import init_db
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers.auth_router import auth_router
from routers.collection_router import collection_router
from routers.items import items_router
from utils.exceptions import http_error_handler

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield #Before yield -> exe on startup | After -> exe on stop

app = FastAPI(title="Collection XIXème siècle", version="0.1", lifespan=lifespan)
app.include_router(auth_router)
app.include_router(collection_router)
app.include_router(items_router)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_exception_handler(HTTPException, http_error_handler)