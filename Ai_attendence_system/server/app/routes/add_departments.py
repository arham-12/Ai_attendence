from fastapi import APIRouter
from app.db.models import Department, DegreeProgram
from app.schemas.schemas import DepartmentCreate ,DegreeProgramData
from app.services.functions_for_db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status


add_department_router = APIRouter()

@add_department_router.post("/add-department")
def add_department(names: DepartmentCreate, db: Session = Depends(get_db)):
    """
    Adds new departments to the database.

    This endpoint accepts a list of department names and adds each department 
    to the database. If a department already exists, a conflict error is raised.

    Args:
        names (DepartmentCreate): List of department names to be added.
        db (Session): Database session dependency.

    Raises:
        HTTPException: If a department already exists in the database, raises a 409 Conflict error.

    Returns:
        dict: Success message indicating that departments were added.
    """
    # Iterate over each department name from the request
    for name in names.names:
        # Check if the department already exists in the database
        existing_department = db.query(Department).filter(Department.name == name).first()
        
        # If department exists, raise a conflict error
        if existing_department:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Department '{name}' already exists")
        
        # Create a new Department object for each unique department name
        department = Department(name=name)
        
        # Add the new department to the session
        db.add(department)
    
    # Commit the session once to persist all departments in the database
    db.commit()

    # Refresh the last added department (optional if needed)
    db.refresh(department)

    # Return a success message
    return {"message": "Departments added successfully"}



@add_department_router.post("/add-degree-program")
def add_degree_program(degree_program_data: DegreeProgramData, db: Session = Depends(get_db)):
    """
    Adds new degree programs to the specified departments.

    This endpoint processes a list of departments, checks if the specified degree programs 
    already exist within each department, and if not, adds the new programs to the database.

    Args:
        degree_program_data (DegreeProgramData): A list of departments with their associated degree programs.
        db (Session): Database session dependency.

    Raises:
        HTTPException: 
            - If a department is not found, raises a 404 Not Found error.
            - If a degree program already exists in the department, raises a 409 Conflict error.

    Returns:
        dict: Success message indicating that degree programs were added.
    """
    
    # Iterate through each department in the degree program data
    for department_data in degree_program_data.departments:
        # Find the department by name in the database
        department = db.query(Department).filter(Department.name == department_data.name).first()

        # Raise error if the department is not found
        if not department:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Department '{department_data.name}' not found")

        # Create a set of existing degree programs for the department to check for duplicates
        existing_program_names = set(
            program.name for program in db.query(DegreeProgram).filter(DegreeProgram.department_id == department.id).all()
        )

        # Initialize a list to store new degree programs to be added
        new_degree_programs = []

        # Loop through each degree program name to check if it's already in the department
        for program_name in department_data.degreePrograms:
            # If the degree program already exists, raise a conflict error
            if program_name in existing_program_names:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Degree program '{program_name}' already exists in '{department_data.name}' department")
            
            # Add the new degree program to the list
            new_degree_programs.append(DegreeProgram(name=program_name, department_id=department.id))

        # Add all the new degree programs to the database session at once
        db.add_all(new_degree_programs)

    # Commit all new degree programs to the database
    db.commit()

    # Return success message
    return {"message": "Degree programs added successfully"}


@add_department_router.get("/get-departments")
def get_departments(db: Session = Depends(get_db)):
    """
    Retrieves a list of all departments from the database.

    This endpoint fetches all departments stored in the database and returns a list of 
    dictionaries containing the department ID and name.

    Args:
        db (Session): Database session dependency.

    Returns:
        list: A list of dictionaries, each containing the department ID and name.
    """
    
    # Query all departments from the database
    departments = db.query(Department).all()

    # Return a list of dictionaries containing department id and name
    return [{"id": dept.id, "name": dept.name} for dept in departments]


@add_department_router.get("/get-degree-programs")
async def get_degree_programs(db: Session = Depends(get_db)):
    """
    Retrieves a list of all degree programs from the database.

    This endpoint fetches all degree programs stored in the database and returns a list of 
    dictionaries containing the degree program ID, name, and department ID.

    Args:
        db (Session): Database session dependency.

    Returns:
        list: A list of dictionaries, each containing the degree program ID, name, and department ID.
    """
    
    # Query all degree programs from the database
    degree_programs = db.query(DegreeProgram).all()

    # Return a list of dictionaries containing degree program id, name, and department id
    return [{"id": program.id, "name": program.name, "department_id": program.department_id} for program in degree_programs]

