from fastapi import FastAPI
from routers.auth_router import router

app = FastAPI(title="Collection XIXème siècle", version="0.1")
app.include_router(router)