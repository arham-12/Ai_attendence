from fastapi import APIRouter, HTTPException,Depends,UploadFile,Query
from sqlalchemy import inspect,text
from sqlalchemy.exc import SQLAlchemyError, NoSuchTableError
from app.services.functions_for_db import get_database_engine, get_table_names
from app.schemas.schemas import TeacherCreate ,StudentCreate,ColumnMappingRequest
from app.db.models import Teacher,Department
from sqlalchemy.orm import Session
from app.services.functions_for_db import get_db
from typing import List, Optional
import pandas as pd

manage_teacher_router = APIRouter()

# Create a new student
@manage_teacher_router.post("/add-student/", response_model=StudentCreate)
def create_student(teacher:TeacherCreate, db: Session = Depends(get_db)):
    db_student = db.query(Teacher).filter(Teacher.student_id == teacher.student_id).first()
    if db_student:
        raise HTTPException(status_code=400, detail="Student ID already registered")
    
    db_student = Teacher(
        student_id=teacher.student_id,
        student_name=teacher.student_name,
        student_email=teacher.student_email,
        department_name=teacher.department_name,
        degree_program=teacher.degree_program,
        semester=teacher.semester,
    )
    
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    
    return db_student




REQUIRED_COLUMNS = ["Student name", "Student ids", "Email", "Degree program", "Semester", "Section"]

@manage_teacher_router.post("/analyze-csv/")
async def analyze_csv(file: UploadFile):
    """
    Analyze the uploaded CSV/Excel and return a response indicating missing or incorrect columns.
    """
    if file.content_type not in ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]:
        raise HTTPException(status_code=400, detail="Only CSV or Excel files are allowed.")
    
    try:
        # Load the file into a DataFrame
        if file.content_type == "text/csv":
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
        
        uploaded_columns = df.columns.tolist()
        missing_columns = [col for col in REQUIRED_COLUMNS if col not in uploaded_columns]
        extra_columns = [col for col in uploaded_columns if col not in REQUIRED_COLUMNS]

        return {
            "uploaded_columns": uploaded_columns,
            "missing_columns": missing_columns,
            "extra_columns": extra_columns,
            "required_columns": REQUIRED_COLUMNS,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@manage_teacher_router.post("/submit-column-mapping/")
async def submit_column_mapping(
    mapping: ColumnMappingRequest,
    file: UploadFile,
    db: Session = Depends(get_db)
):
    """
    Accept corrected column mapping and process the data.
    """
    if file.content_type not in ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]:
        raise HTTPException(status_code=400, detail="Only CSV or Excel files are allowed.")
    
    try:
        # Load the file into a DataFrame
        if file.content_type == "text/csv":
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
        
        # Apply column mapping
        column_mapping = mapping.column_mapping
        df.rename(columns=column_mapping, inplace=True)

        # Validate that all required columns are present
        missing_columns = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns in corrected data: {', '.join(missing_columns)}"
            )

        for _, row in df.iterrows():
            # Check if the student already exists by rollno or email
            existing_student = db.query(Teacher).filter(
                (Teacher.rollno == row["rollno"]) | (Teacher.email == row["email"])
            ).first()

            if existing_student:
                raise HTTPException(
                    status_code=400,
                    detail=f"Student with rollno '{row['rollno']}' or email '{row['email']}' already exists."
                )

            # Create and add the new student to the database
            student = Teacher(
                student_name=row["Student name"],
                student_id =row["Student ids"],
                email=row["Email"],
                degree_program=row["Degree program"],  # Use degree program name directly
                semester=row["Semester"],
                section=row.get("Section"),
            )
            db.add(student)

        # Commit all changes to the database
        db.commit()
        return {"detail": "Students added successfully."}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@manage_teacher_router.get("/search-teachers")
def search_students(
    student_name: Optional[str] = Query(None, description="Filter by student name"),
    student_id: Optional[str] = Query(None, description="Filter by roll number"),
    email: Optional[str] = Query(None, description="Filter by email"),
    degree_program: Optional[str] = Query(None, description="Filter by degree program name"),
    semester: Optional[str] = Query(None, description="Filter by semester"),
    section: Optional[str] = Query(None, description="Filter by section"),
    db: Session = Depends(get_db),
):
    """
    Search students by applying filters.
    All parameters are optional and can be combined.
    """

    # Sanitize query parameters (Optional, as SQLAlchemy handles escaping)
    filters = {
        "student_name": student_name.strip() if student_name else None,
        "student_id": student_id.strip() if student_id else None,
        "email": email.strip() if email else None,
        "degree_program": degree_program.strip() if degree_program else None,
        "semester": semester.strip() if semester else None,
        "section": section.strip() if section else None,
    }

    query = db.query(Teacher)

    # Apply filters dynamically
    if filters["student_name"]:
        query = query.filter(Teacher.student_name.ilike(f"%{filters['name']}%"))
    if filters["student_id"]:
        query = query.filter(Teacher.student_id.ilike(f"%{filters['rollno']}%"))
    if filters["email"]:
        query = query.filter(Teacher.email.ilike(f"%{filters['email']}%"))
    if filters["degree_program"]:
        query = query.filter(Teacher.degree_program.ilike(f"%{filters['degree_program']}%"))
    if filters["semester"]:
        query = query.filter(Teacher.semester.ilike(f"%{filters['semester']}%"))
    if filters["section"]:
        query = query.filter(Teacher.section.ilike(f"%{filters['section']}%"))

    # Fetch results and handle empty responses
    students = query.all()
    if not students:
        raise HTTPException(status_code=404, detail="No students found matching the criteria")

    return students

