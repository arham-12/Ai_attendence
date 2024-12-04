from fastapi import APIRouter
from app.db.models import Student , Teacher
from fastapi import Depends
from sqlalchemy.orm import Session
from app.services.functions_for_db import get_db
from app.schemas.schemas import PieChartResponse, RateResponse, ChartDataResponse



dashboard_router = APIRouter()

@dashboard_router.get("/get_total_students")
async def get_total_students(db: Session = Depends(get_db)):
    """
    Returns the total number of students in the database.

    Args:
    - db (Session): Database session dependency to interact with the database.

    Returns:
    - dict: A dictionary containing the total number of students.
    
    """
    # get the total number of students
    total_students = db.query(Student).count()
    # return the total number of students
    return {"total_students": total_students}


@dashboard_router.get("/get_total_teachers")
async def get_total_teachers(db: Session = Depends(get_db)):
    """
    Returns the total number of teachers in the database.

    Args:
    - db (Session): Database session dependency to interact with the database.

    Returns:
    - dict: A dictionary containing the total number of teachers.
    
    """
    # get the total number of teachers
    total_teachers = db.query(Teacher).count()
    # return the total number of teachers
    return {"total_teachers": total_teachers}



@dashboard_router.get("/api/attendance-rate", response_model=RateResponse)
async def attendance_rate():
    pass

@dashboard_router.get("/api/attendance-chart-data", response_model=ChartDataResponse)
async def attendance_chart_data():
    pass


@dashboard_router.get("/api/pie-chart-data", response_model=PieChartResponse)
async def pie_chart_data():
    
    pass  
