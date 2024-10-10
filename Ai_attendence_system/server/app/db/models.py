from sqlalchemy import Column, Integer, String, ForeignKey, DateTime,Date, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import BYTEA
from datetime import datetime

Base = declarative_base()


"""MODEL FOR PROGRAMS"""
class Program(Base):
    __tablename__ = 'programs'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "Computer Science"
    section = Column(String, nullable=True)  # e.g., "A"
    timing = Column(String, nullable=False)  # e.g., "morning" or "evening"
    semester = Column(String, nullable=False)  # e.g., "Semester 1"
    
    # One-to-Many relationship: one program can have many students
    students = relationship('Student', back_populates='program')

"""MODEL FOR ENROLLED STUDENTS"""
class EnrolledStudent(Base):
    __tablename__ = 'enrolled_students'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    rollno = Column(String, unique=True, nullable=False)  # Roll number of the student
    program_id = Column(Integer, ForeignKey('programs.id'), nullable=False)  # Foreign key to Program
    semester = Column(String, nullable=False)

    program = relationship('Program')

"""MODEL FOR STUDENTS"""
class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    rollno = Column(String, unique=True, nullable=False)  # Roll number of the student
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    image = Column(String, nullable=False)  # Path to the student's image
    program_id = Column(Integer, ForeignKey('programs.id'), nullable=False)  # Foreign key linking the student to a specific program
    semester = Column(String, nullable=False)
    section = Column(String, nullable=False)

    # Relationships
    program = relationship('Program', back_populates='students')
    attendances = relationship('Attendance', back_populates='student')

""""MODEL FOR ADMINS"""
class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

""""MODEL FOR TEACHERS"""
class Teacher(Base):
    __tablename__ = 'teachers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

""""MODEL FOR ATTENDANCE"""
class Attendance(Base):
    __tablename__ = 'attendances'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    program_id = Column(Integer, ForeignKey('programs.id'), nullable=False)
    lecture = Column(String, nullable=False)  # Lecture name or ID
    attendance_status = Column(String, nullable=False)  # e.g., "Present" or "Absent"
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    student = relationship('Student', back_populates='attendances')
    program = relationship('Program')

# Models
class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    instructor_name = Column(String, index=True)
    instructor_id = Column(String, index=True)
    degree_program = Column(String)
    semester = Column(String)
    course_name = Column(String)
    course_code = Column(String)
    class_type = Column(String)

    # Store lecture details as a relationship
    lectures = relationship("Lecture", back_populates="schedule")

class Lecture(Base):
    __tablename__ = "lectures"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    day = Column(String)
    starting_time = Column(Time)
    schedule_id = Column(Integer, ForeignKey("schedules.id"))

    schedule = relationship("Schedule", back_populates="lectures")

class DegreeProgram(Base):
    __tablename__ = "degree_programs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # Degree program name
    department_id = Column(Integer, ForeignKey("departments.id"), index=True)  # Foreign key to Department

    # Relationship to the Department model
    department = relationship("Department", back_populates="degree_programs")

# In your Department model, add the relationship
class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    # Relationship to DegreeProgram
    degree_programs = relationship("DegreeProgram", back_populates="department")