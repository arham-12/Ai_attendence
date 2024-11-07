# main.py
from fastapi import APIRouter, HTTPException
from sqlalchemy import inspect,text
from sqlalchemy.exc import SQLAlchemyError, NoSuchTableError
from app.services.functions_for_db import get_database_engine, get_table_names
from app.schemas.schemas import DatabaseConnectionInfo, TableImportInfo


manage_students_router = APIRouter()



@manage_students_router.post("/connect-db")
async def connect_database(info: DatabaseConnectionInfo):
    """Connect to the specified database and retrieve table names."""
    if not info.db_type or not info.db_name:
        raise HTTPException(status_code=400, detail="Database type and name are required")
    
    try:
        engine = get_database_engine(
            db_type=info.db_type,
            username=info.username,
            password=info.password,
            host=info.host,
            port=info.port,
            db_name=info.db_name
        )
        table_names = get_table_names(engine)
        return {"table_names": table_names}
    except SQLAlchemyError as e:
        print(f"SQLAlchemyError: {str(e)}")  # Debugging log
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")
    except ValueError as e:
        print(f"ValueError: {str(e)}")  # Debugging log
        raise HTTPException(status_code=404, detail=f"No tables found: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")  # Debugging log
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@manage_students_router.post("/import-table")
async def import_table(info: TableImportInfo):
    """Import data from the selected table into the system's database."""
    if not info.table_name:
        raise HTTPException(status_code=400, detail="Table name is required.")
    
    try:
        # Connect to the source database
        source_engine = get_database_engine(
            db_type=info.db_type,
            username=info.username,
            password=info.password,
            host=info.host,
            port=info.port,
            db_name=info.db_name
        )
        
        # Check if table exists
        with source_engine.connect() as connection:
            inspector = inspect(source_engine)
            if info.table_name not in inspector.get_table_names():
                raise HTTPException(status_code=404, detail="Table not found in database.")
            
            # Retrieve data from the selected table
            result = connection.execute(f"SELECT * FROM {info.table_name}")
            data = result.fetchall()
            if not data:
                raise HTTPException(status_code=404, detail="Selected table has no data.")
        
        # Here, add code to import this data into the system's own database
        # (Example: Insert into local database or return preview data)
        
        return {"message": "Data imported successfully", "sample_data": data[:5]}  # Limit sample output
    except NoSuchTableError:
        raise HTTPException(status_code=404, detail="Table does not exist in the database.")
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error importing data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@manage_students_router.post("/fetch-columns")
async def fetch_columns(info: TableImportInfo):
    """Fetch column names from the selected table."""
    if not info.table_name:
        raise HTTPException(status_code=400, detail="Table name is required.")
    
    try:
        # Connect to the source database
        source_engine = get_database_engine(
            db_type=info.db_type,
            username=info.username,
            password=info.password,
            host=info.host,
            port=info.port,
            db_name=info.db_name
        )
        
        # Fetch column names from the selected table
        with source_engine.connect() as connection:
            inspector = inspect(source_engine)
            if info.table_name not in inspector.get_table_names():
                raise HTTPException(status_code=404, detail="Table not found in database.")
            
            columns = [col["name"] for col in inspector.get_columns(info.table_name)]
        
        return {"columns": columns}
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching columns: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    


@manage_students_router.post("/fetch-table-data")
async def fetch_table_data(info: TableImportInfo):
    """Fetch data from the selected table based on specified columns."""
    if not info.table_name:
        raise HTTPException(status_code=400, detail="Table name is required.")
    
    try:
        # Connect to the source database
        source_engine = get_database_engine(
            db_type=info.db_type,
            username=info.username,
            password=info.password,
            host=info.host,
            port=info.port,
            db_name=info.db_name
        )
        
        # Check if table exists
        with source_engine.connect() as connection:
            inspector = inspect(source_engine)
            if info.table_name not in inspector.get_table_names():
                raise HTTPException(status_code=404, detail="Table not found in database.")
            
            # Fetch column names if none are provided
            if not info.columns:
                columns = [col["name"] for col in inspector.get_columns(info.table_name)]
            else:
                columns = info.columns
            
            # Retrieve data from the selected columns
            column_str = ", ".join(columns)  # Prepare the column list for SQL query
            query = text(f"SELECT {column_str} FROM {info.table_name} LIMIT 10")
            result = connection.execute(query)
            data = result.fetchall()
        
        # If no data is found in the selected table
        if not data:
            raise HTTPException(status_code=404, detail="Selected table has no data.")
        
        # Format the result as a list of dictionaries
        column_names = columns
        data_dict = [dict(zip(column_names, row)) for row in data]

        return {"data": data_dict}
    
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
