from app.db.session import SessionLocal

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