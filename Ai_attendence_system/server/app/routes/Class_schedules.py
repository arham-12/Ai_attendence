from tempfile import NamedTemporaryFile
import os
from fastapi import APIRouter, File, UploadFile, Depends ,Query
from fastapi.responses import JSONResponse
from langchain_community.document_loaders.csv_loader import CSVLoader
from app.services.functions_for_schedule import create_vector_store_and_save_uids,load_index,embed_querry,generate_response,prepare_input_for_model
import pandas as pd
from datetime import datetime, date
from app.db.models import Lecture, Schedule
from app.schemas.schemas import DetailedScheduleResponse,ScheduleRequest
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from datetime import datetime, timedelta
from typing import List,Optional
from app.services.functions_for_db import get_db
from sqlalchemy.orm import Session,selectinload
import numpy as np
schedule_router = APIRouter()


@schedule_router.post("/upload-schedule")
async def upload_file(file: UploadFile = File(...)):
    # Check file extension to handle CSV or Excel files
    if file.filename.endswith('.csv'):
        # For CSV, create a temporary file directly
        with NamedTemporaryFile(delete=False, suffix=".csv") as tmp_file:
            contents = await file.read()
            tmp_file.write(contents)
            tmp_file_path = tmp_file.name
    elif file.filename.endswith(('.xls', '.xlsx')):
        # For Excel, convert to CSV
        with NamedTemporaryFile(delete=False, suffix=".csv") as tmp_file:
            # Read the Excel file into a DataFrame
            excel_data = pd.read_excel(file.file)
            # Save as a CSV to the temporary file
            excel_data.to_csv(tmp_file.name, index=False)
            tmp_file_path = tmp_file.name
    else:
        return JSONResponse(content={"message": "Unsupported file format. Please upload a CSV or Excel file."}, status_code=400)

    # Load the CSV file using LangChain's CSVLoader
    loader = CSVLoader(file_path=tmp_file_path)
    data = loader.load()  # Load the CSV data as a list of dictionaries
    print(data)
    
    # Ensure 'vectorstore' directory exists
    vectorstore_dir = "vectorstore"
    if not os.path.exists(vectorstore_dir):
        os.makedirs(vectorstore_dir)

    # Create the vector store and save UIDs
    index_file_path = create_vector_store_and_save_uids(data, vectorstore_dir)

    # Clean up: delete the temporary file after processing
    os.remove(tmp_file_path)

    return JSONResponse(content={"message": f"File uploaded and vector store saved as {index_file_path}."})



@schedule_router.get("/get-schedule")
async def get_schedule():
    vectorstore_dir = "vectorstore"
    current_day = datetime.now().strftime("%A") 
    print(f"The current day is {current_day}")  # Get current day (e.g., "Monday")
    all_classes = []

    # Go through each index subdirectory in the vectorstore directory
    for foldername in os.listdir(vectorstore_dir):
        folder_path = os.path.join(vectorstore_dir, foldername)

        # Check if it is a directory
        if os.path.isdir(folder_path):
            index_file_path = os.path.join(folder_path, "index.faiss")
            # Load the FAISS index
            if os.path.exists(index_file_path):
                vector_store = load_index(folder_path)  # Load from the folder

                # Example: Query for today's classes based on the current day
                query = f"classes on {current_day}"  # Adjust this query based on how classes are stored
                # query_vector = generate_embedding([query])[0]  # Get the embedding for the query

                # Perform the search using the vector store
                docs = vector_store.similarity_search(query ,k=2)  # Perform the similarity search

                print(f"Found {docs} classes for '{query}'")
                all_classes.append(docs)  # Use extend to combine results

    # Prepare the response based on the found classes
    prompt = prepare_input_for_model(str(all_classes))
    response = generate_response(prompt)

    # Return all found classes as a JSON response
    return {"classes": response}




# Function to check for conflicts
def check_for_conflicts(instructor_id: str, lecture_dates: List[str], db: Session):
    # Query to check for conflicts in the schedules
    return db.query(Schedule).join(Lecture).filter(
        Schedule.instructor_id == instructor_id,
        Lecture.date.in_(lecture_dates)
    ).all()

# Endpoint to generate the schedule
@schedule_router.post("/generate-schedule", response_model=DetailedScheduleResponse)
async def generate_schedule(schedule: ScheduleRequest, db: Session = Depends(get_db)):
    try:
        start_date = datetime.strptime(schedule.start_date, "%Y-%m-%d")
        end_date = datetime.strptime(schedule.end_date, "%Y-%m-%d")
        starting_time = datetime.strptime(schedule.starting_time, '%I:%M %p').time()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use 'YYYY-MM-DD'.")

    if start_date >= end_date:
        raise HTTPException(status_code=400, detail="Start date must be before end date.")
    
    if schedule.num_lectures <= 0:
        raise HTTPException(status_code=400, detail="Number of lectures must be positive.")
    
    preferred_weekdays = schedule.preferred_weekdays or ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    valid_weekdays = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
    
    if not all(day in valid_weekdays for day in preferred_weekdays):
        raise HTTPException(status_code=400, detail="Invalid weekday(s) provided.")

    current_date = start_date
    lecture_dates = []
    lecture_days = []
    
    while len(lecture_dates) < schedule.num_lectures and current_date <= end_date:
        if current_date.strftime("%A") in preferred_weekdays:
            lecture_dates.append(current_date.strftime("%Y-%m-%d"))
            lecture_days.append(current_date.strftime("%A"))
        current_date += timedelta(days=1)

    if len(lecture_dates) < schedule.num_lectures:
        raise HTTPException(
            status_code=400,
            detail="Could not schedule all lectures within the given time range and weekday constraints."
        )
    
    # Check for scheduling conflicts with the instructor's existing schedules
    conflicts = check_for_conflicts(schedule.instructor_id, lecture_dates, db)
    if conflicts:
        raise HTTPException(
            status_code=400,
            detail="Scheduling conflict detected with existing schedule."
        )
    
    # Add the new schedule if no conflicts are detected
    new_schedule = Schedule(
        instructor_name=schedule.instructor_name,
        instructor_id=schedule.instructor_id,
        degree_program=schedule.degree_program,
        semester=schedule.semester,
        course_name=schedule.course_name,
        course_code=schedule.course_code,
        class_type=schedule.class_type,
        
    )
    
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)

    # Add lecture details
    for date, day in zip(lecture_dates, lecture_days):
        lecture = Lecture(date=datetime.strptime(date, "%Y-%m-%d"), day=day, schedule_id=new_schedule.id, starting_time=starting_time)
        db.add(lecture)
    
    db.commit()

    return DetailedScheduleResponse(
        instructor_name=schedule.instructor_name,
        instructor_id=schedule.instructor_id,
        degree_program=schedule.degree_program,
        semester=schedule.semester,
        course_name=schedule.course_name,
        course_code=schedule.course_code,
        class_type=schedule.class_type,
        starting_time=starting_time,
        lecture_dates=lecture_dates,
        lecture_days=lecture_days
    )
@schedule_router.get("/api/schedules")
def get_schedules(db: Session = Depends(get_db)):
    # Get the current date
    today = date.today()

    # Start the query from the Schedule table and join with lectures
    query = (
        db.query(Schedule)
        .join(Schedule.lectures)
        .options(selectinload(Schedule.lectures))
        .filter(Lecture.date == today)  # Filter for today's lectures
    )

    # Execute the query to get schedules with today's lectures
    schedules = query.all()

    # Prepare the response to include required fields
    response = []
    for schedule in schedules:
        for lecture in schedule.lectures:
            if lecture.date == today:  # Ensure each lecture is on today's date
                response.append({
                    "id": schedule.id,
                    "instructor_name": schedule.instructor_name,
                    "degree_program": schedule.degree_program,
                    "semester": schedule.semester,
                    "course_name": schedule.course_name,
                    "course_code": schedule.course_code,
                    "class_type": schedule.class_type,
                    "lecture_date": lecture.date,
                    "day": lecture.day
                })

    return response




@schedule_router.get("/api/schedules")
def get_schedules(db: Session = Depends(get_db)):
    # Get the current date
    today = date.today()

    # Start the query from the Schedule table and join with lectures
    query = (
        db.query(Schedule)
        .join(Schedule.lectures)
        .options(selectinload(Schedule.lectures))
        .filter(Lecture.date == today)  # Filter for today's lectures
    )

    # Execute the query to get schedules with today's lectures
    schedules = query.all()

    # Prepare the response to include required fields
    response = []
    for schedule in schedules:
        for lecture in schedule.lectures:
            if lecture.date == today:  # Ensure each lecture is on today's date
                response.append({
                    "id": schedule.id,
                    "instructor_name": schedule.instructor_name,
                    "degree_program": schedule.degree_program,
                    "semester": schedule.semester,
                    "course_name": schedule.course_name,
                    "course_code": schedule.course_code,
                    "class_type": schedule.class_type,
                    "starting_time": lecture.starting_time,
                    "lecture_date": lecture.date,
                    "day": lecture.day
                })

    return response
