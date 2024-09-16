from fastapi import FastAPI
from app.routes.auth import auth_router
from app.routes.dashboard import dashboard_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(dashboard_router)