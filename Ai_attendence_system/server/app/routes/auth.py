
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.models import Student , Admin, Teacher
from app.schemas.schemas import StudentLoginSchema, AdminLoginSchema, TeacherLoginSchema
from app.services.funtcions_for_auth import get_password_hash, verify_password, create_access_token
from typing import Optional
import base64
import os 


auth_router = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



UPLOAD_DIR = "static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@auth_router.post("/register")
async def register_student(
    name: str=Form(...),
    email: str = Form(...),
    rollno: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Register a new student.

    Args:
        name (str): The name of the student.
        email (str): The email of the student.
        rollno (str): The roll number of the student.
        password (str): The password of the student.
        confirm_password (str): The password confirmation of the student.
        image (UploadFile): The image file of the student.

    Returns:
        dict: A dictionary containing the response message.

    Raises:
        HTTPException: If the passwords do not match or if the student already exists.
    """
    # Validate passwords match
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check if the student already exists
    existing_student = db.query(Student).filter(
        (Student.email == email) | (Student.rollno == rollno)).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Email or Roll No already exists")
    
    hashed_password = get_password_hash(password)
    image_path = None

    if image:
        file_location = os.path.join(UPLOAD_DIR, image.filename)
        try:
            with open(file_location, "wb") as buffer:
                buffer.write(await image.read())
            image_path = file_location
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving file: {e}")

    new_student = Student(
        name=name,
        email=email,
        rollno=rollno,
        hashed_password=hashed_password,  # Store the file path in the database
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {"response": "Student registered successfully"}
@auth_router.post("/login-student")
def login_student(login_data: StudentLoginSchema, db: Session = Depends(get_db)):
    

    student = db.query(Student).filter(Student.email == login_data.email).first()
    if not student or not verify_password(login_data.password, student.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": student.email})
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.post("/admin_login")
async def admin_login(admin_login: AdminLoginSchema , db: Session = Depends(get_db)):

    """
    Authenticates an admin user and generates an access token.  

    Args:
        form_data (OAuth2PasswordRequestForm): The form data containing username and password.

    Returns:
        dict: A dictionary containing the access token and token type.

    Raises:
        HTTPException: If the username or password is incorrect.
    """
    admin = db.query(Admin).filter(Admin.email == Admin.email).first()
    if not admin or not verify_password(admin_login.password, admin.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": admin.email})
    return {"access_token": access_token, "token_type": "bearer"}



@auth_router.post("/teacher-login")
async def admin_login(teacher_login: TeacherLoginSchema , db: Session = Depends(get_db)):

    """
    Authenticates an admin user and generates an access token.  

    Args:
        form_data (OAuth2PasswordRequestForm): The form data containing username and password.

    Returns:
        dict: A dictionary containing the access token and token type.

    Raises:
        HTTPException: If the username or password is incorrect.
    """
    teacher = db.query(Teacher).filter(Teacher.Teacher_name == teacher_login.teachername).first()
    if not teacher or not verify_password(teacher_login.password, teacher.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": teacher.email})
    return {"access_token": access_token, "token_type": "bearer"}



@auth_router.post("/register-teacher")
async def register_teacher(
    teachername: str=Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Register a new teacher.

    Args:
        teachername (str): The name of the teacher.
        password (str): The password of the teacher.

    Returns:
        dict: A dictionary containing the response message.

    Raises:
        HTTPException: If the teacher already exists.
    """
    # Check if the teacher already exists
    existing_teacher = db.query(Teacher).filter(Teacher.Teacher_name == teachername).first()
    if existing_teacher:
        raise HTTPException(status_code=400, detail="Teacher already exists")
    hashed_password = get_password_hash(password)
    new_teacher = Teacher(
        Teacher_name=teachername,
        hashed_password=hashed_password
    )
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)

    return {"response": "Teacher registered successfully"}