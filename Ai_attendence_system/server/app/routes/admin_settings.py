# main.py
from fastapi import APIRouter, Depends, HTTPException
from app.services.functions_for_db import get_db
from sqlalchemy.orm import Session
from app.db.models import Department, DegreeProgram, Semester, Course
from app.schemas.schemas import DepartmentUpdate,DegreeProgramUpdate ,CourseUpdate


admin_settings_router = APIRouter()


@admin_settings_router.post("/departments")
def create_department(data: dict, db: Session = Depends(get_db)):
    """
    Create a new department with its associated degree programs, semesters, and courses.
    
    Args:
    - data (dict): Dictionary containing department name, degree programs, semesters, and courses.
    - db (Session): Database session dependency to perform DB operations.
    
    Returns:
    - dict: Success message along with the created department's ID.
    """

    # Extract department name and degree programs from the incoming request data
    department_name = data.get("departmentName")
    degree_programs = data.get("degreePrograms", [])

    # Check if the department already exists in the database
    existing_department = db.query(Department).filter_by(name=department_name).first()
    if existing_department:
        # Raise an exception if the department already exists
        raise HTTPException(status_code=400, detail="Department already exists")

    # Create a new Department instance
    department = Department(name=department_name)

    # Iterate over the list of degree programs provided in the request
    for program in degree_programs:
        # Create a new DegreeProgram instance and associate it with the department
        degree_program = DegreeProgram(name=program.get("programName"), department=department)

        # Iterate over the semesters in each degree program
        for semester in program.get("semesters", []):
            # Create a new Semester instance and associate it with the degree program
            sem = Semester(name=semester.get("semesterName"), degree_program=degree_program)

            # Iterate over the courses in each semester
            for course in semester.get("courses", []):
                # Create a new Course instance with course name and credit hours, and associate it with the semester
                course_obj = Course(name=course.get("courseName"), credit_hours=course.get("creditHours"), semester=sem)
                
                # Append the created course to the semester's course list
                sem.courses.append(course_obj)

            # Append the created semester to the degree program's semester list
            degree_program.semesters.append(sem)

        # Append the created degree program to the department's degree program list
        department.degree_programs.append(degree_program)

    # Add the new department (along with all associated degree programs, semesters, and courses) to the DB session
    db.add(department)

    # Commit the transaction to save the department and its related entities to the database
    db.commit()

    # Refresh the department instance to reflect the updated state (e.g., getting the auto-generated department ID)
    db.refresh(department)

    # Return a success message with the ID of the newly created department
    return {"message": "Department created successfully", "department_id": department.id}


@admin_settings_router.get("/departments/{department_name}/{program_name}")
def get_department_details(department_name: str, program_name: str, db: Session = Depends(get_db)):
    """
    Fetch the details of a department by its name and a specific degree program within that department.
    
    Args:
    - department_name (str): Name of the department to fetch.
    - program_name (str): Name of the degree program to filter within the department.
    - db (Session): Database session dependency for querying the database.
    
    Returns:
    - dict: Dictionary containing department and filtered degree program details, including semesters and courses.
    """
    
    # Fetch the department from the database by the department name
    department = db.query(Department).filter(Department.name == department_name).first()
    
    # If the department is not found, raise a 404 HTTP exception
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")

    # Search for the specified degree program within the department's degree programs
    degree_program = next((dp for dp in department.degree_programs if dp.name == program_name), None)
    
    # If the degree program is not found within the department, raise a 404 HTTP exception
    if not degree_program:
        raise HTTPException(status_code=404, detail="Degree Program not found in the specified department")

    # Return the details of the department, including the specific degree program with its semesters and courses
    return {
        "id": department.id,  # Department ID
        "name": department.name,  # Department name
        "degree_programs": [{  # List containing the details of the matched degree program
            "id": degree_program.id,  # Degree Program ID
            "name": degree_program.name,  # Degree Program name
            "semesters": [{  # List of semesters under the degree program
                "id": semester.id,  # Semester ID
                "name": semester.name,  # Semester name
                "courses": [{  # List of courses under the semester
                    "id": course.id,  # Course ID
                    "name": course.name,  # Course name
                    "credit_hours": course.credit_hours  # Credit hours for the course
                } for course in semester.courses]  # Loop over all courses in the semester
            } for semester in degree_program.semesters]  # Loop over all semesters in the degree program
        }]
    }


@admin_settings_router.get("/departments")
def get_all_departments(db: Session = Depends(get_db)):
    """
    Retrieve details of all departments, including their associated degree programs, semesters, and courses.

    Args:
    - db (Session): Database session dependency to fetch data from the database.

    Returns:
    - list: A list of departments, each with their degree programs, semesters, and courses.
    """
    
    # Fetch all departments from the database
    departments = db.query(Department).all()
    
    # Initialize an empty list to store the response
    response = []
    
    # Iterate over each department in the result
    for department in departments:
        # Prepare the department data structure with basic details
        department_data = {
            "id": department.id,  # Department ID
            "name": department.name,  # Department name
            "degree_programs": []  # Placeholder for the list of degree programs
        }
        
        # Iterate over degree programs associated with the department
        for degree_program in department.degree_programs:
            # Prepare the degree program data structure
            degree_program_data = {
                "id": degree_program.id,  # Degree Program ID
                "name": degree_program.name,  # Degree Program name
                "semesters": []  # Placeholder for the list of semesters
            }
            
            # Iterate over semesters associated with the degree program
            for semester in degree_program.semesters:
                # Prepare the semester data structure
                semester_data = {
                    "id": semester.id,  # Semester ID
                    "name": semester.name,  # Semester name
                    "courses": []  # Placeholder for the list of courses
                }
                
                # Iterate over courses associated with the semester
                for course in semester.courses:
                    # Prepare the course data structure
                    course_data = {
                        "id": course.id,  # Course ID
                        "name": course.name,  # Course name
                        "credit_hours": course.credit_hours  # Course credit hours
                    }
                    # Append the course data to the corresponding semester
                    semester_data["courses"].append(course_data)
                
                # Append the semester data to the corresponding degree program
                degree_program_data["semesters"].append(semester_data)
            
            # Append the degree program data to the corresponding department
            department_data["degree_programs"].append(degree_program_data)
        
        # Append the fully constructed department data to the response list
        response.append(department_data)
    
    # Print the response (for debugging or logging purposes, can be removed in production)
    print(response)
    
    # Return the list of departments with their associated data
    return response


@admin_settings_router.put("/departments/update")
async def update_department(department_update: DepartmentUpdate, db: Session = Depends(get_db)):
    """
    Update the name of an existing department. This endpoint checks if the department exists 
    and updates its name if found, while ensuring that no trailing whitespace is included.

    Args:
    - department_update (DepartmentUpdate): Object containing the current and new department names.
    - db (Session): Database session dependency to interact with the database.

    Returns:
    - dict: A success message along with the updated department name.
    """
    
    # Check if the new department name contains any trailing white spaces and remove them
    department_update.new_name = department_update.new_name.strip()
    
    # Fetch the department by its current name from the database
    department = db.query(Department).filter(Department.name == department_update.current_name).first()
    
    # If the department is not found, raise a 404 HTTP exception
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # Update the department's name with the new name provided
    department.name = department_update.new_name
    
    # Commit the changes to the database to save the updated department name
    db.commit()
    db.refresh(department)  # Refresh the instance to reflect updated values
    
    # Return a success message along with the updated department name
    return {"message": "Department updated successfully", "department_name": department.name}


@admin_settings_router.put("/degree-programs/update")
async def update_degree_program(degree_program_update: DegreeProgramUpdate, db: Session = Depends(get_db)):
    """
    Update the name of an existing degree program. This endpoint checks if the degree program exists
    and updates its name if found, ensuring that no trailing whitespace is included.

    Args:
    - degree_program_update (DegreeProgramUpdate): Object containing the current and new degree program names.
    - db (Session): Database session dependency to interact with the database.

    Returns:
    - dict: A success message along with the updated degree program name.
    """
    
    # Remove any trailing white space from the new degree program name
    degree_program_update.new_name = degree_program_update.new_name.strip()
    
    # Fetch the degree program by its current name from the database
    degree_program = db.query(DegreeProgram).filter(DegreeProgram.name == degree_program_update.current_name).first()
    
    # If the degree program is not found, raise a 404 HTTP exception
    if degree_program is None:
        raise HTTPException(status_code=404, detail="Degree program not found")
    
    # Update the degree program's name with the new name provided
    degree_program.name = degree_program_update.new_name
    
    # Commit the changes to the database to save the updated degree program name
    db.commit()
    db.refresh(degree_program)  # Refresh the instance to reflect the updated values
    
    # Return a success message along with the updated degree program name
    return {"message": "Degree program updated successfully", "degree_program_name": degree_program.name}


@admin_settings_router.put("/courses/update")
async def update_course(course_update: CourseUpdate, db: Session = Depends(get_db)):
    """
    Update the name and credit hours of an existing course. This endpoint checks if the course exists
    and updates its name and credit hours if found, ensuring that no trailing whitespace is included.

    Args:
    - course_update (CourseUpdate): Object containing the current and new course names, and updated credit hours.
    - db (Session): Database session dependency to interact with the database.

    Returns:
    - dict: A success message along with the updated course name and credit hours.
    """
    
    # Remove any trailing white space from the new course name
    course_update.new_name = course_update.new_name.strip()

    # Fetch the course by its current name from the database
    course = db.query(Course).filter(Course.name == course_update.current_name).first()
    
    # If the course is not found, raise a 404 HTTP exception
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Update the course's name and credit hours
    course.name = course_update.new_name
    course.credit_hours = course_update.credit_hours
    
    # Commit the changes to the database to save the updated course details
    db.commit()
    db.refresh(course)  # Refresh the instance to reflect the updated values
    
    # Return a success message with the updated course name and credit hours
    return {
        "message": "Course updated successfully", 
        "course_name": course.name, 
        "course_credit_hours": course.credit_hours
    }
