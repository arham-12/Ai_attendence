
# API Endpoints

## Bulk Student Insertion API


#### Description
Bulk inserts student records by validating and processing a CSV/Excel file. The request body must include a file (CSV/Excel) and optionally a JSON mapping of column names.

#### Request

- **URL**: `http://localhost:8000/bulk-student-insertion/`
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
    "wrong_name": "student_name",
    "wrong_student_id": "student_id",
    "wrong_email": "student_email",
    "wrong_program": "degree_program",
    "wrong_semester": "semester",
    "wrong_section": "section"
  }

## Bulk Teacher Insertion API

#### Description
Bulk inserts teacher records by validating and processing a CSV/Excel file. The request body must include a file (CSV/Excel) and optionally a JSON mapping of column names.

#### Request

- **URL**: `http://localhost:8000/bulk-teacher-insertion/`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

#### Request Body

The request body should contain the following fields:

- `file` (required): The CSV or Excel file containing the teacher records. The file should contain the following columns:
  - `teacher_name`
  - `teacher_email`
  - `degree_program`

- `columns` (optional): A JSON string for column name mapping. The keys should be the actual column names in the uploaded file, and the values should be the desired column names to match the required ones. Example:
  
  ```json
  {
    "wrong_name": "teacher_name",
    "wrong_email": "teacher_email",
    "wrong_program": "degree_program"
  }