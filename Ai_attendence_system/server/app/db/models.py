from sqlalchemy import Column, Integer, String, ForeignKey, DateTime,Date, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import BYTEA
from datetime import datetime

Base = declarative_base()


class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, nullable=False)
    student_id = Column(String, unique=True, nullable=False)  # Roll number of the student
    email = Column(String, unique=True, index=True, nullable=False)  # Email of the student
    degree_program_name = Column(String, ForeignKey('degree_programs.name'), nullable=False)  # Foreign key to DegreeProgram
    semester = Column(String, nullable=False)
    section = Column(String, nullable=True)

    # Relationships
    attendances = relationship('Attendance', back_populates='student')
    degree_program = relationship("DegreeProgram", back_populates="students")

# Admin Model
class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)




class DegreeProgram(Base):
    __tablename__ = "degree_programs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)   # Degree program name
    department_id = Column(Integer, ForeignKey("departments.id"), index=True)  # Foreign key to Department

    # Relationships
    department = relationship("Department", back_populates="degree_programs")
    students = relationship("Student", back_populates="degree_program")


# Teacher Model
class Teacher(Base):
    __tablename__ = 'teachers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)  # Foreign key to Department

    # Relationships
    department = relationship("Department", back_populates="teachers")
    schedules = relationship("Schedule", back_populates="teacher")


# Attendance Model
class Attendance(Base):
    __tablename__ = 'attendances'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)  # Foreign key to Student
    degree_program_id = Column(Integer, ForeignKey('degree_programs.id'), nullable=False)  # Foreign key to DegreeProgram
    lecture = Column(String, nullable=False)  # Lecture name or ID
    attendance_status = Column(String, nullable=False)  # e.g., "Present" or "Absent"
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    student = relationship('Student', back_populates='attendances')
    degree_program = relationship('DegreeProgram')


# Schedule Model
class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)  # Foreign key to Teacher
    degree_program_id = Column(Integer, ForeignKey("degree_programs.id"), nullable=False)  # Foreign key to DegreeProgram
    semester = Column(String, nullable=False)
    course_name = Column(String, nullable=False)
    course_code = Column(String, nullable=False)
    class_type = Column(String)

    # Relationships
    teacher = relationship("Teacher", back_populates="schedules")
    degree_program = relationship("DegreeProgram")
    lectures = relationship("Lecture", back_populates="schedule")


# Lecture Model
class Lecture(Base):
    __tablename__ = "lectures"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    day = Column(String, nullable=False)
    starting_time = Column(Time, nullable=False)
    schedule_id = Column(Integer, ForeignKey("schedules.id"))

    schedule = relationship("Schedule", back_populates="lectures")


# Department Model
class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    # Relationships
    degree_programs = relationship("DegreeProgram", back_populates="department")
    teachers = relationship("Teacher", back_populates="department")