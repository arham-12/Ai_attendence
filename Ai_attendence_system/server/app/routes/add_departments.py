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
    # Loop through the list of department names
    for name in names.names:
        # Check if the department already exists
        existing_department = db.query(Department).filter(Department.name == name).first()
        if existing_department:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Department '{name}' already exists")
        
        # Add the department to the database
        department = Department(name=name)
        db.add(department)
    
    # Commit once for all new departments
    db.commit()
    db.refresh(department)
    return {"message": "Departments added successfully"}



@add_department_router.post("/add-degree-program")
def add_degree_program(degree_program_data: DegreeProgramData, db: Session = Depends(get_db)):
    for department_data in degree_program_data.departments:
        # Find the department by name
        department = db.query(Department).filter(Department.name == department_data.name).first()

        if not department:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Department '{department_data.name}' not found")

        # Create a set to track existing degree programs for the department
        existing_program_names = set(
            program.name for program in db.query(DegreeProgram).filter(DegreeProgram.department_id == department.id).all()
        )

        # Loop through the degree program names
        new_degree_programs = []
        for program_name in department_data.degreePrograms:
            if program_name in existing_program_names:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Degree program '{program_name}' already exists in '{department_data.name}' department")
            # Add the new degree program to the list
            new_degree_programs.append(DegreeProgram(name=program_name, department_id=department.id))

        # Add all new degree programs to the session
        db.add_all(new_degree_programs)

    # Commit all new degree programs
    db.commit()
    return {"message": "Degree programs added successfully"}


@add_department_router.get("/get-departments")
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    return [{"id": dept.id, "name": dept.name} for dept in departments]