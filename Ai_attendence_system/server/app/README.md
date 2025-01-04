# Bulk Student Insertion API

## Description
This API enables bulk insertion of student records by validating and processing a CSV or Excel file containing student details such as name, ID, email, degree program, semester, and section.

## API Endpoint

### POST http://localhost:8000/bulk-student-insertion/

#### Description
Bulk inserts student records by validating and processing a CSV/Excel file. The request body must include a file (CSV/Excel) and optionally a JSON mapping of column names.

#### Request

- **URL**: `/bulk-student-insertion/`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

#### Request Body

The request body should contain the following fields:

- `file` (required): The CSV or Excel file containing the student records. The file should contain the following columns:
  - `student_name`
  - `student_id`
  - `student_email`
  - `degree_program`
  - `semester`
  - `section`

- `columns` (optional): A JSON string for column name mapping. The keys should be the actual column names in the uploaded file, and the values should be the desired column names to match the required ones. Example:
  
  ```json
  {
    "name": "student_name",
    "id": "student_id",
    "email": "student_email",
    "program": "degree_program",
    "semester": "semester",
    "section": "section"
  }
