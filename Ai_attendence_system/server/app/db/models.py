from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
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
"""MODEL FOR STUDENTS"""
class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    rollno = Column(String, unique=True, nullable=False)  # Roll number of the student
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    image = Column(String, nullable=False)  # Path to the student's image
    
    # Foreign key linking the student to a specific program
    program_id = Column(Integer, ForeignKey('programs.id'), nullable=False)

    # Relationship back to Program
    program = relationship('Program', back_populates='students')

    # Attendance relationship for easier access to student's attendance records
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




""""MODEL FOR DEPARTMENTS"""
class Department(Base):
    __tablename__ = 'departments'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)

    # Relationship to DegreeProgram
    degree_programs = relationship("DegreeProgram", back_populates="department", cascade="all, delete-orphan")


""""MODEL FOR DEGREE PROGRAMS"""
class DegreeProgram(Base):
    __tablename__ = 'degree_programs'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey('departments.id'))

    # Relationships
    department = relationship("Department", back_populates="degree_programs")
    semesters = relationship("Semester", back_populates="degree_program", cascade="all, delete-orphan")


""""MODEL FOR SEMESTERS"""
class Semester(Base):
    __tablename__ = 'semesters'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    degree_program_id = Column(Integer, ForeignKey('degree_programs.id'))

    # Relationships
    degree_program = relationship("DegreeProgram", back_populates="semesters")
    courses = relationship("Course", back_populates="semester", cascade="all, delete-orphan")


""""MODEL FOR COURSES"""
# Course Model
class Course(Base):
    __tablename__ = 'courses'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    credit_hours = Column(Integer) 
    semester_id = Column(Integer, ForeignKey('semesters.id'))

    # Relationships
    semester = relationship("Semester", back_populates="courses")