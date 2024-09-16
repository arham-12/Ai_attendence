# SQLAlchemy models
from sqlalchemy import Column, Integer, String , ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import BYTEA
from sqlalchemy.orm import relationship
Base = declarative_base()

class Programs(Base):
    __tablename__ = 'programs'

    id = Column(Integer, primary_key=True, index=True)
    program = Column(String, nullable=False)  # e.g. "Computer Science"
    section = Column(String, nullable=True)  # e.g. "A"
    timming = Column(String, nullable=False) # "morning" or "evening"
    # One-to-Many relationship: one program can have many students
    students = relationship('Student', back_populates='program')


class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True, index=True) # primary key
    name = Column(String, nullable=False) # name of the student
    email = Column(String, unique=True, index=True, nullable=False)# email of the student
    rollno = Column(String, unique=True, nullable=False)# roll number of the student
    hashed_password = Column(String, nullable=False)# hashed password of the student
    image = Column(String, nullable=False)# path of student image

    # Foreign key linking the student to a specific program
    program_id = Column(Integer, ForeignKey('programs.id'))# program id
    
    # Relationship back to Programs
    program = relationship('Programs', back_populates='students')# program object

class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class Teacher(Base):
    __tablename__ = 'teachers'

    id = Column(Integer, primary_key=True, index=True)
    Teacher_name= Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
