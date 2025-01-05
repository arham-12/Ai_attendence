# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.models import Student, DegreeProgram
from backend.serializer import StudentSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.renderers import JSONRenderer
import pandas as pd
import json
# View for handling Students
class StudentAPIView(APIView):
    serializer_class = StudentSerializer

    def get(self, request, student_id: str = None):
        if student_id:
            # Fetch a specific student
            try:
                student = Student.objects.get(student_id=student_id)
                serializer = self.serializer_class(student)
                return Response(serializer.data)
            except Student.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Fetch all students
            students = Student.objects.all()
            serializer = self.serializer_class(students, many=True)
            return Response(serializer.data)

    @extend_schema(request=StudentSerializer)
    def post(self, request):
        degree_program_name = request.data.get("degree_program")
        try:
            degree_program = DegreeProgram.objects.get(program_name=degree_program_name)
        except DegreeProgram.DoesNotExist:
            return Response({"detail": "Degree Program not found."}, status=status.HTTP_400_BAD_REQUEST)

        student_data = request.data.copy()
        serializer = self.serializer_class(data=student_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=StudentSerializer)
    def put(self, request, student_id: str = None):
        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, student_id=None):
        try:
            student = Student.objects.get(student_id=student_id)
            student.delete()
            return Response({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Student.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

# Bulk Student insertion view 
class BulkStudentInsertionAPIView(APIView):
    @extend_schema(
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "file": {
                        "type": "string",
                        "format": "binary",
                        "description": "Upload a CSV or Excel file containing teacher data."
                    },
                    "columns": {
                        "type": "object",
                        "description": "Mapping of column names to desired column names."
                    }
                },
                "required": ["file"]
            }
        },
    )
    def post(self, request):
        """
        Bulk inserts students by validating and processing a CSV/Excel file.
        Content-Type: multipart/form-data
        Request Body: Must contain a file (CSV/Excel) and optional column mapping (JSON).
        Response: Returns success message or detailed error on missing/invalid data.
        """
        # Required columns
        required_columns = ["student_name", "student_id", "student_email", "degree_program", "semester", "section"]

                # Parse the 'columns' field to a dictionary
        columns_str = request.data.get("columns", "{}")  # Default to empty dict if missing
        try:
            columns = json.loads(columns_str)  # Convert the string into a dictionary
        except json.JSONDecodeError:
            return Response({"detail": "Invalid JSON format for 'columns'."}, status=status.HTTP_400_BAD_REQUEST)
        

        # Validate uploaded file
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"detail": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt to read the file as CSV or Excel
        try:
            if uploaded_file.name.endswith(".csv"):
                data = pd.read_csv(uploaded_file)
            elif uploaded_file.name.endswith((".xls", ".xlsx")):
                data = pd.read_excel(uploaded_file)
            else:
                return Response({"detail": "Unsupported file format. Upload a CSV or Excel file."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Error reading file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            # Check if the number of columns matches
        if len(data.columns) != len(required_columns):
            return Response(
                {
                    "detail": f"The number of columns in the file ({len(data.columns)}) does not match the required columns ({len(required_columns)}).",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )



        # Rename columns based on the received mapping
        if isinstance(columns, dict):
            data.rename(columns=columns, inplace=True)
        else:
            return Response({"detail": "Invalid 'columns' format."}, status=status.HTTP_400_BAD_REQUEST)


        # Check for missing columns
        missing_columns = [col for col in required_columns if col not in data.columns]
        wrong_columns = [col for col in data.columns if col not in required_columns]
        if missing_columns or wrong_columns:
            return Response(
                {"detail": "Missing or invalid columns.", "missing_columns": missing_columns, "required_columns": required_columns, "wrong_columns": wrong_columns},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Validate degree programs and prepare for bulk insertion
        invalid_rows = []
        valid_records = []
        degree_program_cache = {dp.program_name: dp for dp in DegreeProgram.objects.all()}  # Cache existing programs

        for index, row in data.iterrows():
            degree_program_name = row.get("degree_program")
            if degree_program_name not in degree_program_cache.keys():
                invalid_rows.append({"row": index + 1, "degree_program": degree_program_name})
                continue

            # Prepare valid student record
            valid_records.append(
                Student(
                    student_name=row["student_name"],
                    student_id=row["student_id"],
                    student_email=row["student_email"],
                    degree_program=degree_program_cache[degree_program_name],
                    semester=row["semester"],
                    section=row["section"],
                )
            )

        # Handle invalid rows
        if invalid_rows:
            return Response(
                {"detail": "Invalid degree programs found.", "invalid_rows": invalid_rows},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Bulk create valid records
        try:
            Student.objects.bulk_create(valid_records)
        except Exception as e:
            return Response({"detail": f"Error saving records: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {"detail": f"Successfully added {len(valid_records)} students."},
            status=status.HTTP_201_CREATED,
        )