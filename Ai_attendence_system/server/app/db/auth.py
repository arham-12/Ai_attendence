from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base



Base = declarative_base()


# Admin Model
class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
