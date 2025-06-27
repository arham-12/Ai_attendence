from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from backend.models.TeachersModels import Teachers,TeacherPasswords, TeacherToken
from backend.models.SchedulingModels import GeneratedSchedule
from rest_framework.authtoken.models import Token
from backend.models.DegreeProgramModels import DegreeProgram
from backend.Serializers.TeacherSerializers import TeacherSerializer, TeacherPasswordSerializer, TeacherLoginSerializer
from drf_spectacular.utils import extend_schema
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.renderers import JSONRenderer
import secrets
from datetime import date
import pandas as pd
import json
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from backend.authentication import TeacherTokenAuth
# View for handling Teachers
@extend_schema(tags=['Teacher API'])
class TeacherAPIView(APIView):
    serializer_class = TeacherSerializer

    @extend_schema(request=TeacherSerializer)
    def get(self, request, teacher_email: str = None):
        if teacher_email:
            # Fetch a specific teacher
            try:
                teacher = Teachers.objects.filter(teacher_email__icontains=teacher_email)
                serializer = self.serializer_class(teacher,many=True)
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
@extend_schema(tags=['Teacher API'])
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
@extend_schema(tags=['Teacher API'])
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
        required_columns = ["teacher_name", "teacher_email", "degree_program","teaching_type"]

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
                {"existing_columns": data.columns, "required_columns": required_columns, "wrong_columns": wrong_columns},
                status=status.HTTP_400_BAD_REQUEST,
            )
        print("Data: ", data)
        
        # Validate degree programs and prepare for bulk insertion
        invalid_rows = []
        valid_records = []

        for index, row in data.iterrows():
            degree_program_name = row.get("degree_program", "").strip()
            print("Degree Program Name from file: ", degree_program_name)

            try:
                # Query the DegreeProgram table for a matching program
                matched_program = DegreeProgram.objects.get(program_name__icontains=degree_program_name)
            except DegreeProgram.DoesNotExist:
                # Add invalid row to the list if no match is found
                invalid_rows.append({"row": index + 1, "degree_program": degree_program_name})
                continue

            # Replace the degree program name in the row with the exact match from the database
            row["degree_program"] = matched_program.program_name

            # Create valid teacher record
            valid_records.append(
                Teachers(
                    teacher_name=row["teacher_name"],
                    teacher_email=row["teacher_email"],
                    degree_program=matched_program,  # Set the foreign key
                    teaching_type=row["teaching_type"]
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
    

@extend_schema(tags=['Teacher API'])
class TeacherDegreeProgramView(APIView):
    def get(self, request, degree_program: str):
        """Retrieve only the teacher names for a specific degree program."""
        teachers = Teachers.objects.filter(degree_program__program_name__icontains=degree_program)
        serializer = TeacherSerializer(teachers, many=True)
        print("Teachers: ", serializer.data)
        # Extract just the teacher names into a list
        teacher_names = [teacher["teacher_name"] for teacher in serializer.data]
        return Response({"teacher_names":teacher_names})

@extend_schema(tags=['Teacher API'])
class TeacherCountView(APIView):
    def get(self, request):
        """Retrieve the total number of teachers."""
        count = Teachers.objects.count()
        return Response({"teacher_count": count})
    


@extend_schema(tags=['Teacher API'])
class TeacherLoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=TeacherLoginSerializer)
    def post(self, request):
        serializer = TeacherLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                teacher = Teachers.objects.get(teacher_email=email)

                # Check if password is already set
                if hasattr(teacher, 'password_details'):
                    stored_hashed_password = teacher.password_details.password
                    if check_password(password, stored_hashed_password):
                        token = secrets.token_hex(20)  # 40 chars
                        # Create or update token
                        TeacherToken.objects.update_or_create(
                            teacher=teacher,
                            defaults={"token": token}
                        )
                        return Response({
                            "message": "Login successful",
                            "token": token,
                            "teacher_name": teacher.teacher_name,
                            "teacher_id": teacher.id
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    # First time password set
                    hashed_password = make_password(password)
                    TeacherPasswords.objects.create(teacher=teacher, password=hashed_password)
                    token = secrets.token_hex(20)
                    TeacherToken.objects.update_or_create(
                        teacher=teacher,
                        defaults={"token": token}
                    )
                    return Response({
                        "message": "Password set and login successful",
                        "token": token,
                        "teacher_name": teacher.teacher_name,
                        "teacher_id": teacher.id
                    }, status=status.HTTP_200_OK)

            except Teachers.DoesNotExist:
                return Response({"error": "Unauthorized: Email not recognized"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
@extend_schema(tags=['Teacher API'])
class GetTeacherScheduleView(APIView):
    authentication_classes = [TeacherTokenAuth]
    permission_classes = [IsAuthenticated]
    def get(self, request, teacher_id: int):
        try:
            teacher = Teachers.objects.get(id=teacher_id)
            today = date.today()

            schedules = GeneratedSchedule.objects.filter(
                teacher=teacher,
                lecture_date=today
            ).select_related('course', 'degree_program')

            schedule_list = []
            for sched in schedules:
                schedule_list.append({
                    "schedule_id":sched.id,
                    "course_name": sched.course.course_name,
                    "degree_program": sched.degree_program.program_name,
                    "semester": sched.semester,
                    "lecture_date": sched.lecture_date,
                    "start_time": sched.start_time,
                    "end_time": sched.end_time,
                })

            return Response({
                "teacher_name": teacher.teacher_name,
                "teaching_type": teacher.teaching_type,
                "all_schedules": schedule_list
            }, status=status.HTTP_200_OK)

        except Teachers.DoesNotExist:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)
        
@extend_schema(tags=['Teacher API'])
class GetAllTeacherSchedulesView(APIView):
    authentication_classes = [TeacherTokenAuth]
    permission_classes = [IsAuthenticated]

    def get(self, request, teacher_id: int):
        try:
            teacher = Teachers.objects.get(id=teacher_id)

            schedules = GeneratedSchedule.objects.filter(
                teacher=teacher
            ).select_related('course', 'degree_program')

            schedule_list = []
            for sched in schedules:
                schedule_list.append({
                    "schedule_id":sched.id,
                    "course_name": sched.course.course_name,
                    "degree_program": sched.degree_program.program_name,
                    "semester": sched.semester,
                    "lecture_date": sched.lecture_date,
                    "start_time": sched.start_time,
                    "end_time": sched.end_time,
                })

            return Response({
                "teacher_name": teacher.teacher_name,
                "teaching_type": teacher.teaching_type,
                "all_schedules": schedule_list
            }, status=status.HTTP_200_OK)

        except Teachers.DoesNotExist:
            return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)
        

@extend_schema(tags=['Teacher API'])
class GetAllSchedulesView(APIView):

    def get(self, request):
        schedules = GeneratedSchedule.objects.select_related('teacher', 'course', 'degree_program').all()

        schedule_list = []
        for sched in schedules:
            schedule_list.append({
                "teacher_name": sched.teacher.teacher_name,
                "teaching_type": sched.teacher.teaching_type,
                "degree_program": sched.degree_program.program_name,
                "semester": sched.semester,
                "course_name": sched.course.course_name,
                "lecture_date": sched.lecture_date,
                "start_time": sched.start_time,
                "end_time": sched.end_time,
            })

        return Response(schedule_list, status=status.HTTP_200_OK)
