from tempfile import NamedTemporaryFile
import os
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from langchain_community.document_loaders.csv_loader import CSVLoader
from app.services.functions_for_schedule import create_vector_store_and_save_uids,load_index,embed_querry,generate_response,prepare_input_for_model
import pandas as pd
from datetime import datetime
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