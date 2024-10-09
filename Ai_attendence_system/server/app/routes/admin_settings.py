# main.py
from fastapi import APIRouter, Depends, HTTPException
from app.services.functions_for_db import get_db
from sqlalchemy.orm import Session
from app.db.models import Admin
from app.schemas.schemas import AdminLoginSchema
from app.services.funtcions_for_auth import get_password_hash


admin_settings_router = APIRouter()


@admin_settings_router.post("/change-admin-password")
async def change_password(admin_login: AdminLoginSchema, db: Session = Depends(get_db)):
    """
    Changes the password of the admin user. The function first deletes the existing admin user
    and then creates a new admin account with the updated password.

    Args:
    - admin_login (AdminLoginSchema): Object containing the new admin credentials (email and password).
    - db (Session): Database session dependency to interact with the database.

    Returns:
    - dict: A response indicating the password change was successful.
    """

    # Fetch the existing admin by the default email (admin@gmail.com)
    admin = db.query(Admin).filter(Admin.email == "admin@gmail.com").first()

    # If the admin exists, delete the admin record from the database
    if admin:
        db.delete(admin)
        db.commit()

    # Hash the new password for the admin
    hashed_password = get_password_hash(admin_login.password)

    # Create a new admin record with the updated email and hashed password
    new_admin = Admin(email=admin_login.email, password=hashed_password)

    # Add the new admin to the database and commit the changes
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)  # Refresh the instance to reflect the new values

    # Return a success message indicating the password was changed
    return {"response": "Password changed successfully"}


