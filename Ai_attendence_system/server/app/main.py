from fastapi import FastAPI
from app.routes.auth import auth_router
from app.routes.dashboard import dashboard_router
from fastapi.middleware import cors
from app.routes.admin_settings import admin_settings_router
from app.routes.Class_schedules import schedule_router
from app.routes.add_departments import add_department_router
from app.routes.manage_students import manage_students_router
app = FastAPI()



app.add_middleware(
    cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(add_department_router)
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(admin_settings_router)
app.include_router(schedule_router)
app.include_router(manage_students_router)