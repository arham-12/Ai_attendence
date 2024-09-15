# services/funtcions_for_auth.py
from jose import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM


# Initialize the password context for hashing and verifying passwords using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """
    Verifies a plain password against a hashed password.

    Args:
        plain_password (str): The plain text password to be verified.
        hashed_password (str): The hashed password stored in the database.

    Returns:
        bool: True if the plain password matches the hashed password, otherwise False.
    """
    # Verify if the plain password matches the hashed password using the password context
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """
    Generates a hashed version of the provided plain text password.

    Args:
        password (str): The plain text password to be hashed.

    Returns:
        str: The hashed password.
    """
    # Hash the provided plain text password using the password context
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Creates an access token with the specified expiration time.

    Args:
        data (dict): The data to include in the token's payload.
        expires_delta (timedelta, optional): The time duration from now until the token expires. 
                                             If not provided, the token will use the default expiration time.

    Returns:
        str: The encoded JWT access token.
    """
    # Create a copy of the data dictionary to include in the token payload
    to_encode = data.copy()
    
    # Determine the expiration time for the token
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Add the expiration time to the payload
    to_encode.update({"exp": expire})
    
    # Encode the payload into a JWT token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    # Optionally print the encoded JWT for debugging purposes
    print(encoded_jwt)
    
    return encoded_jwt

#
