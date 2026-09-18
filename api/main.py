from fastapi import FastAPI

app = FastAPI(title="Collection XIXème siècle", version="0.1")
app.include_router(router)