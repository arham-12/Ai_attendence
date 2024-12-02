from pydantic import BaseModel, EmailStr, constr, root_validator,Field
from typing import Optional,List ,Dict



class DepartmentCreate(BaseModel):
    names: List[str]


class DepartmentDegreePrograms(BaseModel):
    name: str
    degreePrograms: List[str]

class DegreeProgramData(BaseModel):
    departments: List[DepartmentDegreePrograms]
class StudentRegistrationSchema(BaseModel):
    name: str
    email: EmailStr
    rollno: str
    password: str
    confirm_password: str  # Added field for password confirmation
    program_id: int  # Reference to the foreign key 'program_id'
    
    # Storing the local path of the uploaded image
    image_path: Optional[str]

    # Root validator to check if password and confirm_password match
    @root_validator(pre=True)
    def check_passwords_match(cls, values):
        password = values.get('password')
        confirm_password = values.get('confirm_password')
        if password != confirm_password:
            raise ValueError("Passwords do not match")
        return values

class ClassSchema(BaseModel):
    program : str
    section : Optional[str]
    timming : str

    class Config:
        orm_mode = True


class StudentLoginSchema(BaseModel):
    email: str
    password: str

class StudentResponseSchema(BaseModel):
    id: int
    name: str
    email: EmailStr
    rollno: str # Use a string to store file path or URL

    class Config:
        orm_mode = True

class AdminLoginSchema(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True

class TeacherLoginSchema(BaseModel):
    Teacher_name : str
    password: str

    class Config:
        orm_mode = True



class DepartmentUpdate(BaseModel):
    current_name: str
    new_name: str


# Pydantic model for the degree program update
class DegreeProgramUpdate(BaseModel):
    current_name: str
    new_name: str


# Pydantic model for the course update
class CourseUpdate(BaseModel):
    current_name: str
    new_name: str
    credit_hours: int



class RateResponse(BaseModel):
    rate: float

class ChartDataResponse(BaseModel):
    labels: List[str]
    values: List[int]

class PieChartResponse(BaseModel):
    values: List[int]


# Request and Response Models
class ScheduleRequest(BaseModel):
    instructor_name: str
    instructor_id: str
    degree_program: str
    semester: str
    course_name: str
    course_code: str
    class_type: str
    start_date: str
    starting_time: str
    end_date: str
    num_lectures: int
    preferred_weekdays: Optional[List[str]] = None

class DetailedScheduleResponse(BaseModel):
    instructor_name: str
    instructor_id: str
    degree_program: str
    semester: str
    course_name: str
    course_code: str
    class_type: str
    starting_time: str
    lecture_dates: List[str]
    lecture_days: List[str]


class DatabaseConnectionInfo(BaseModel):
    db_type: str
    username: str = None
    password: str = None
    host: str = None
    port: int = None
    db_name: str

# Define TableImportInfo as a Pydantic model
class TableImportInfo(BaseModel):
    db_type: str
    username: Optional[str] = None  # Optional field
    password: Optional[str] = None  # Optional field
    host: Optional[str] = None  # Optional field
    port: Optional[str] = None  # Optional field
    db_name: str
    table_name: str
    columns: List[str] = []  # Default empty list

    class Config:
        orm_mode = True  # Ensures Pydantic can work with SQLAlchemy models (if necessary)


class StudentCreate(BaseModel):
    student_id: str
    student_name: str
    student_email: str
    department_name: str
    degree_program: str
    semester: str

    class Config:
        orm_mode = True


class ColumnMappingRequest(BaseModel):
    column_mapping: Dict[str, str]  # {"uploaded_column": "required_column"}
