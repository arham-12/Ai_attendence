from fastapi import FastAPI
from app.routes.auth import auth_router
from app.routes.dashboard import dashboard_router
from fastapi.middleware import cors
from app.routes.admin_settings import admin_settings_router
app = FastAPI()



app.add_middleware(
    cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(admin_settings_router)