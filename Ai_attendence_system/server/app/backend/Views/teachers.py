from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.models import Teachers,TeacherPasswords,DegreeProgram
from backend.serializer import TeacherSerializer,TeacherPasswordSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.renderers import JSONRenderer
import pandas as pd
import json

# View for handling Teachers
class TeacherAPIView(APIView):
    serializer_class = TeacherSerializer

    @extend_schema(request=TeacherSerializer)
    def get(self, request, teacher_email: str = None):
        if teacher_email:
            # Fetch a specific teacher
            try:
                teacher = Teachers.objects.get(teacher_email=teacher_email)
                serializer = self.serializer_class(teacher)
                return Response(serializer.data)
            except Teachers.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Fetch all teachers
            teachers = Teachers.objects.all()
            serializer = self.serializer_class(teachers, many=True)
            return Response(serializer.data)
        
    @extend_schema(request=TeacherSerializer)
    def post(self, request):
            # Create a new teacher
            teacher_serializer = self.serializer_class(data=request.data)
            
            if teacher_serializer.is_valid():
                # Save the teacher data
                teacher = teacher_serializer.save()
                
                # Check if password data is provided in the request
                password_data = request.data.get("password")
                if password_data:
                    # Prepare password data for the `TeacherPasswordSerializer`
                    password_serializer = TeacherPasswordSerializer(data={
                        'teacher_email': teacher.teacher_email,
                        'password': password_data
                    })
                    
                    if password_serializer.is_valid():
                        # Save the password data
                        password_serializer.save()
                    else:
                        # If password data is invalid, delete the created teacher
                        teacher.delete()
                        return Response(password_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                return Response(teacher_serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(teacher_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @extend_schema(request=TeacherSerializer)
    def put(self, request, teacher_email: str = None):
        if teacher_email:     
            try:
                teacher = Teachers.objects.get(teacher_email=teacher_email)
            except Teachers.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.serializer_class(teacher, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)    
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Email not provided."}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=TeacherSerializer)
    def delete(self, request, teacher_email: str = None):
        if teacher_email:
            try:
                teacher = Teachers.objects.get(teacher_email=teacher_email)
                teacher.delete()
                return Response({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            except Teachers.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "Email not provided."}, status=status.HTTP_400_BAD_REQUEST)
        


# View for handling TeacherPasswords
class TeacherPasswordView(APIView):
    serializer_class = TeacherPasswordSerializer
    @extend_schema(request=TeacherPasswordSerializer)
    def post(self, request):
        """Add a password for an existing teacher."""
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def get(self, request):
    #     """Retrieve all teacher passwords."""
    #     passwords = TeacherPasswords.objects.select_related('teacher').all()
    #     serializer = TeacherPasswordSerializer(passwords, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)


# View for handling bulk teacher insertion
class BulkTeacherInsertionAPIView(APIView):
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
        print("Request data: ", request.data)
        
        # Required columns
        required_columns = ["teacher_name", "teacher_email", "degree_program"]

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
                {"missing_columns": missing_columns, "required_columns": required_columns, "wrong_columns": wrong_columns},
                status=status.HTTP_400_BAD_REQUEST,
            )
        print("Data: ", data)
        
        # Validate degree programs and prepare for bulk insertion
        invalid_rows = []
        valid_records = []
        degree_program_cache = {dp.program_name: dp for dp in DegreeProgram.objects.all()}  # Cache existing programs
        print("Degree Program Cache: ", degree_program_cache)
        
        for index, row in data.iterrows():
            degree_program_name = row.get("degree_program")
            print("Degree Program Name: ", degree_program_name)
            # Check if the degree program exists in the cache
            if degree_program_name not in degree_program_cache.keys():
                invalid_rows.append({"row": index + 1, "degree_program": degree_program_name})
                continue

            # Create valid teacher record
            valid_records.append(
                Teachers(
                    teacher_name=row["teacher_name"],
                    teacher_email=row["teacher_email"],
                    degree_program=degree_program_cache.get(degree_program_name)  # Set the foreign key
                )
            )

        # Handle invalid rows
        if invalid_rows:
            return Response(
                {"detail": "Invalid degree program found." ,"degree_program_name":list({i["degree_program"] for i in invalid_rows})},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Bulk create valid records
        try:
            Teachers.objects.bulk_create(valid_records)
        except Exception as e:
            return Response({"detail": f"Error saving records: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {"detail": f"Successfully added {len(valid_records)} teachers."},
            status=status.HTTP_201_CREATED,
        )
