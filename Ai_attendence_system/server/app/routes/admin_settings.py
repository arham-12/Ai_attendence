# main.py
from fastapi import APIRouter, Depends, HTTPException
from app.services.functions_for_db import get_db
from sqlalchemy.orm import Session
from app.db.models import Department, DegreeProgram, Semester, Course

admin_settings_router = APIRouter()

@admin_settings_router.post("/departments")
def create_department(data: dict, db: Session = Depends(get_db)):
    # Extract data from the incoming request
    department_name = data.get("departmentName")
    degree_programs = data.get("degreePrograms", [])

    # Check if the department already exists
    existing_department = db.query(Department).filter_by(name=department_name).first()
    if existing_department:
        raise HTTPException(status_code=400, detail="Department already exists")

    # Create Department
    department = Department(name=department_name)

    # Add Degree Programs, Semesters, and Courses
    for program in degree_programs:
        degree_program = DegreeProgram(name=program.get("programName"), department=department)

        for semester in program.get("semesters", []):
            sem = Semester(name=semester.get("semesterName"), degree_program=degree_program)

            for course in semester.get("courses", []):
                course_obj = Course(name=course.get("courseName"), cedit_hours=course.get("creditHours"),  semester=sem)
                sem.courses.append(course_obj)

            degree_program.semesters.append(sem)

        department.degree_programs.append(degree_program)

    # Add to DB and commit
    db.add(department)
    db.commit()
    db.refresh(department)

    return {"message": "Department created successfully", "department_id": department.id}
