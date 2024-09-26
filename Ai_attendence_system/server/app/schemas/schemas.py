from pydantic import BaseModel, EmailStr, constr, root_validator
from typing import Optional
from fastapi import UploadFile, File
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