from app.db.session import SessionLocal
from sqlalchemy import create_engine, inspect
from sqlalchemy.exc import SQLAlchemyError, OperationalError

def get_db():
    """
    Get a database session.

    Returns:
        Session: A database session.
    """
    # get the database session
    db = SessionLocal()
    # return the database session
    try:
        # yield the database session
        yield db
    finally:
        # close the database session
        db.close()



def get_database_engine(db_type, username, password, host, port, db_name):
    """Creates a database engine for the given database type and credentials."""
    try:
        if db_type == "postgresql":
            connection_str = f"postgresql://{username}:{password}@{host}:{port}/{db_name}"
        elif db_type == "mysql":
            connection_str = f"mysql+pymysql://{username}:{password}@{host}:{port}/{db_name}"
        elif db_type == "sqlite":
            connection_str = f"sqlite:///{db_name}"
        else:
            raise ValueError("Unsupported database type")

        print(f"Connection String: {connection_str}")  # Debugging log

        engine = create_engine(connection_str)
        # Test connection
        engine.connect()
        return engine
    except (OperationalError, ValueError) as e:
        raise SQLAlchemyError(f"Connection error: {e}")


def get_table_names(engine):
    """Returns a list of table names from the connected database."""
    try:
        inspector = inspect(engine)
        table_names = inspector.get_table_names()
        if not table_names:
            raise ValueError("No tables found in the database.")
        return table_names
    except SQLAlchemyError as e:
        raise SQLAlchemyError(f"Error retrieving tables: {e}")

