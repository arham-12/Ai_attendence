# main.py
from fastapi import APIRouter, HTTPException,Depends,UploadFile,Query
from sqlalchemy import inspect,text
from sqlalchemy.exc import SQLAlchemyError, NoSuchTableError
from app.services.functions_for_db import get_database_engine, get_table_names
from app.schemas.schemas import DatabaseConnectionInfo, TableImportInfo,StudentCreate,ColumnMappingRequest
from app.db.models import Student,DegreeProgram
from sqlalchemy.orm import Session
from app.services.functions_for_db import get_db
from typing import List, Optional
import pandas as pd
manage_students_router = APIRouter()



@manage_students_router.post("/connect-db")
async def connect_database(info: DatabaseConnectionInfo):
    """Connect to the specified database and retrieve table names."""
    if not info.db_type or not info.db_name:
        raise HTTPException(status_code=400, detail="Database type and name are required")
    
    try:
        engine = get_database_engine(
            db_type=info.db_type,
            username=info.username,
            password=info.password,
            host=info.host,
            port=info.port,
            db_name=info.db_name
        )
        table_names = get_table_names(engine)
        return {"table_names": table_names}
    except SQLAlchemyError as e:
        print(f"SQLAlchemyError: {str(e)}")  # Debugging log
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")
    except ValueError as e:
        print(f"ValueError: {str(e)}")  # Debugging log
        raise HTTPException(status_code=404, detail=f"No tables found: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")  # Debugging log
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@manage_students_router.post("/import-table")
async def import_table(info: TableImportInfo):
    """Import data from the selected table into the system's database."""
    if not info.table_name:
        raise HTTPException(status_code=400, detail="Table name is required.")
    
    try:
        # Connect to the source database
        source_engine = get_database_engine(
            db_type=info.db_type,
            username=info.username,
            password=info.password,
            host=info.host,
            port=info.port,
            db_name=info.db_name
        )
        
        # Check if table exists
        with source_engine.connect() as connection:
            inspector = inspect(source_engine)
            if info.table_name not in inspector.get_table_names():
                raise HTTPException(status_code=404, detail="Table not found in database.")
            
            # Retrieve data from the selected table
            result = connection.execute(f"SELECT * FROM {info.table_name}")
            data = result.fetchall()
            if not data:
                raise HTTPException(status_code=404, detail="Selected table has no data.")
        
        # Here, add code to import this data into the system's own database
        # (Example: Insert into local database or return preview data)
        
        return {"message": "Data imported successfully", "sample_data": data[:5]}  # Limit sample output
    except NoSuchTableError:
        raise HTTPException(status_code=404, detail="Table does not exist in the database.")
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error importing data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@manage_students_router.post("/fetch-columns")
async def fetch_columns(info: TableImportInfo):
    """Fetch column names from the selected table."""
    if not info.table_name:
        raise HTTPException(status_code=400, detail="Table name is required.")
    
    try:
        # Connect to the source database
        source_engine = get_database_engine(
            db_type=info.db_type,
            username=info.username,
            password=info.password,
            host=info.host,
            port=info.port,
            db_name=info.db_name
        )
        
        # Fetch column names from the selected table
        with source_engine.connect() as connection:
            inspector = inspect(source_engine)
            if info.table_name not in inspector.get_table_names():
                raise HTTPException(status_code=404, detail="Table not found in database.")
            
            columns = [col["name"] for col in inspector.get_columns(info.table_name)]
        
        return {"columns": columns}
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching columns: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    


@manage_students_router.post("/fetch-table-data")
async def fetch_table_data(info: TableImportInfo):
    """Fetch data from the selected table based on specified columns."""
    if not info.table_name:
        raise HTTPException(status_code=400, detail="Table name is required.")
    
    try:
        # Connect to the source database
        source_engine = get_database_engine(
            db_type=info.db_type,
            username=info.username,
            password=info.password,
            host=info.host,
            port=info.port,
            db_name=info.db_name
        )
        
        # Check if table exists
        with source_engine.connect() as connection:
            inspector = inspect(source_engine)
            if info.table_name not in inspector.get_table_names():
                raise HTTPException(status_code=404, detail="Table not found in database.")
            
            # Fetch column names if none are provided
            if not info.columns:
                columns = [col["name"] for col in inspector.get_columns(info.table_name)]
            else:
                columns = info.columns
            
            # Retrieve data from the selected columns
            column_str = ", ".join(columns)  # Prepare the column list for SQL query
            query = text(f"SELECT {column_str} FROM {info.table_name} LIMIT 10")
            result = connection.execute(query)
            data = result.fetchall()
        
        # If no data is found in the selected table
        if not data:
            raise HTTPException(status_code=404, detail="Selected table has no data.")
        
        # Format the result as a list of dictionaries
        column_names = columns
        data_dict = [dict(zip(column_names, row)) for row in data]

        return {"data": data_dict}
    
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")




@manage_students_router.post("/add-student/", response_model=StudentCreate)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    # Check if the student ID already exists
    db_student = db.query(Student).filter(Student.student_id == student.student_id).first()
    if db_student:
        raise HTTPException(status_code=400, detail="Student ID already registered")
    
    # Look for the degree program by name
    db_degree_program = db.query(DegreeProgram).filter(DegreeProgram.name == student.degree_program).first()

    if not db_degree_program:
        raise HTTPException(status_code=400, detail="Degree program does not exist")
    
    # Create a new student and link it to the found degree program by its ID
    db_student = Student(
        student_id=student.student_id,
        student_name=student.student_name,
        student_email=student.student_email,
        degree_program_id=db_degree_program.id,  # Use the degree_program_id
        semester=student.semester,
        section=student.section
    )
    
    # Add and commit the new student
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    
    return db_student




REQUIRED_COLUMNS = ["student_name", "student_id", "student_email", "degree_program", "semester", "section"]

@manage_students_router.post("/analyze-csv/")
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


@manage_students_router.post("/submit-column-mapping/")
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
            existing_student = db.query(Student).filter(
                (Student.student_id == row["student_id"]) | (Student.student_email == row["student_email"])
            ).first()

            if existing_student:
                raise HTTPException(
                    status_code=400,
                    detail=f"Student with rollno '{row['student_id']}' or email '{row['student_email']}' already exists."
                )

            # Create and add the new student to the database
            student = Student(
                student_name=row["Student name"],
                student_id =row["Student ids"],
                email=row["student_email"],
                degree_program=row["degree_program"],  # Use degree program name directly
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

@manage_students_router.get("/search-students")
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

    query = db.query(Student)

    # Apply filters dynamically
    if filters["student_name"]:
        query = query.filter(Student.student_name.ilike(f"%{filters['name']}%"))
    if filters["student_id"]:
        query = query.filter(Student.student_id.ilike(f"%{filters['rollno']}%"))
    if filters["email"]:
        query = query.filter(Student.email.ilike(f"%{filters['email']}%"))
    if filters["degree_program"]:
        query = query.filter(Student.degree_program.ilike(f"%{filters['degree_program']}%"))
    if filters["semester"]:
        query = query.filter(Student.semester.ilike(f"%{filters['semester']}%"))
    if filters["section"]:
        query = query.filter(Student.section.ilike(f"%{filters['section']}%"))

    # Fetch results and handle empty responses
    students = query.all()
    if not students:
        raise HTTPException(status_code=404, detail="No students found matching the criteria")

    return students