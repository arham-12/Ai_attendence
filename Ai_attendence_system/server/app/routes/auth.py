import os 
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.session import SessionLocal, engine
from app.db.models import Student , Admin, Teacher , Program
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.schemas.schemas import StudentLoginSchema, AdminLoginSchema, TeacherLoginSchema
from app.services.funtcions_for_auth import get_password_hash, verify_password, create_access_token



auth_router = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



UPLOAD_DIR = "static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@auth_router.post("/register-student/")
async def register_student(
    name: str = Form(...),
    email: str = Form(...),
    rollno: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    program_name: str = Form(...),
    section: str = Form(None),
    semester: str = Form(...),
    timming: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Ensure the passwords match
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Ensure the upload directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Define the image file path with a unique name (e.g., using the student's roll number)
    image_filename = f"{rollno}.jpg"  # You can also use other formats or unique IDs
    image_path = os.path.join(UPLOAD_DIR, image_filename)

    # Save the uploaded image file to the server
    with open(image_path, "wb") as image_file:
        content = await image.read()  # Read the file content
        image_file.write(content)  # Save the binary content to a file

    # Check if the student already exists by email or roll number
    existing_student = db.query(Student).filter(
        (Student.email == email) | (Student.rollno == rollno)
    ).first()

    if existing_student:
        # If the student is already present, raise an error
        raise HTTPException(status_code=400, detail="Student with this email or roll number already exists.")

    # Find or create the program
    program = db.query(Program).filter(
        Program.name == program_name,
        Program.section == section
    ).first()

    if not program:
        # If the program doesn't exist, create it
        program = Program(
            name=program_name,
            section=section,
            timing=timming,
            semester=semester  # or any other relevant value
        )
        db.add(program)
        try:
            db.commit()  # Commit the new program
            db.refresh(program)  # Refresh the program to get the id
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Error in creating program.")

    # Hash the password and create a new student record
    hashed_password = get_password_hash(password)

    new_student = Student(
        name=name,
        email=email,
        rollno=rollno,
        hashed_password=hashed_password,
        program_id=program.id,  # Link to the program
        image=image_path  # Store the local path of the uploaded image
    )

    try:
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error in adding student to the database.")

    return {"response": "Student registered successfully", "student": new_student}
@auth_router.post("/login-student")
def login_student(StudentLogin: StudentLoginSchema, db: Session = Depends(get_db)):
    

    student = db.query(Student).filter(Student.email == StudentLogin.email).first()
    if not student or not verify_password(StudentLogin.password, student.hashed_password):
        raise HTTPException(status_code=400, detail="Please enter valid email or password")
    
    access_token = create_access_token(data={"sub": student.email})
    return {"access_token": access_token, "token_type": "bearer", "status": "student"}

@auth_router.post("/change-admin-password")
async def change_password(admin_login: AdminLoginSchema , db: Session = Depends(get_db)):

    admin = db.query(Admin).filter(Admin.email == "admin@gmail.com").first()
    if admin:
        db.delete(admin)
        db.commit()


    hashed_password = get_password_hash(admin_login.password)
    new_admin = Admin(email=admin_login.email, password=hashed_password)    


    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"response": "Password changed successfully"}

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

    Returns:Teacher_name
        dict: A dictionary containing the access token and token type.

    Raises:
        HTTPException: If the username or password is incorrect.
    """
    teacher = db.query(Teacher).filter(Teacher.Teacher_name == teacher_login.Teacher_name).first()
    if not teacher or not verify_password(teacher_login.password, teacher.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": teacher.Teacher_name})
    return {"access_token": access_token, "token_type": "bearer","status":"teacher"}



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