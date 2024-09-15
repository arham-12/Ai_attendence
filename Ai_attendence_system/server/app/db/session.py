# DB connection
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models import Base

SQLALCHEMY_DATABASE_URL = "postgresql://arham:arham-12@localhost/Ai-atendence"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in the database
Base.metadata.create_all(bind=engine)
