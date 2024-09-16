from fastapi import APIRouter
from app.db.models import Student , Teacher
from app.db.session import SessionLocal

from fastapi import Depends

from sqlalchemy.orm import Session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

dashboard_router = APIRouter()


@dashboard_router.get("/get_total_students")
async def get_total_students(db: Session = Depends(get_db)):
    total_students = db.query(Student).count()
    return {"total_students": total_students}


@dashboard_router.get("/get_total_teachers")
async def get_total_teachers(db: Session = Depends(get_db)):
    total_teachers = db.query(Teacher).count()
    return {"total_teachers": total_teachers}


     
