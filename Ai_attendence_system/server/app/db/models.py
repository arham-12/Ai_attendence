from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import BYTEA
from datetime import datetime

Base = declarative_base()

class Program(Base):
    __tablename__ = 'programs'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "Computer Science"
    section = Column(String, nullable=True)  # e.g., "A"
    timing = Column(String, nullable=False)  # e.g., "morning" or "evening"
    semester = Column(String, nullable=False)  # e.g., "Semester 1"
    
    # One-to-Many relationship: one program can have many students
    students = relationship('Student', back_populates='program')

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

class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Teacher(Base):
    __tablename__ = 'teachers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

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
