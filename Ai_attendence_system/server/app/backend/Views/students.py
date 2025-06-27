# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from backend.Serializers.CourseSerializer import CourseSerializer
from backend.models.StudentsModels import Student ,StudentCredential,StudentToken
from rest_framework.authtoken.models import Token
from backend.models.DegreeProgramModels import DegreeProgram
from rest_framework.parsers import MultiPartParser, FormParser
from backend.Serializers.StudentSerializers import StudentSerializer,StudentRegistrationSerializer,StudentLoginSerializer
from django.contrib.auth.hashers import check_password
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, inline_serializer,extend_schema_field
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from backend.models.AttendenceModels import Attendance
from datetime import date
from backend.models.CourseModels import Course
from backend.models.SchedulingModels import GeneratedSchedule
from backend.authentication import StudentTokenAuth
from backend.models.AttendenceModels import Classroom
from rest_framework.renderers import JSONRenderer
import pandas as pd
import json
# View for handling Students
@extend_schema(tags=["Student's APIs"])
class StudentAPIView(APIView):
    serializer_class = StudentSerializer

    def get(self, request, student_id: str = None):
        if student_id:
            # Fetch students matching the partial student_id
            students = Student.objects.filter(student_id__icontains=student_id)
            if students.exists():
                serializer = self.serializer_class(students, many=True)
                return Response(serializer.data)
            else:
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
@extend_schema(tags=["Student's APIs"])
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
        print(request.data)
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
                {"detail": "Missing or invalid columns.", "existing_columns": data.columns, "required_columns": required_columns, "wrong_columns": wrong_columns},
                status=status.HTTP_400_BAD_REQUEST,
            )
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

            # Prepare valid student record
            valid_records.append(
                Student(
                    student_name=row["student_name"],
                    student_id=row["student_id"],
                    student_email=row["student_email"],
                    degree_program=matched_program,  # Use the matched program directly
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
    

@extend_schema(tags=["Student's APIs"])
class  StudentCountView(APIView):
    def get(self, request):
        """Returns the total number of students."""
        students_count = Student.objects.count()
      
        return Response({"student_count": students_count})
    


# 👇 Define a custom schema for the ImageField
@extend_schema_field(field=OpenApiTypes.BINARY)
class CustomImageField(serializers.ImageField):
    pass

@extend_schema(
    tags=["Student's APIs"],
    request=inline_serializer(
        name="StudentRegistrationSerializer",
        fields={
            "student_id": serializers.CharField(),
            "password": serializers.CharField(write_only=True),
            "confirm_password": serializers.CharField(write_only=True),
            # 👇 Use the custom field with schema override
            "face_image": CustomImageField(style={"base_template": "file.html"}),
        },
    ),
    examples=[
        OpenApiExample(
            "Example Request",
            value={
                "student_id": "ST002",
                "password": "YourSecret123",
                "confirm_password": "YourSecret123",
                "face_image": None,  # Example value for binary
            },
            request_only=True,
            media_type="multipart/form-data",
        )
    ],
    responses={201: ...},
)
class StudentRegistrationView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]


    def post(self, request, *args, **kwargs):
        serializer = StudentRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Student registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Student's APIs"])
class StudentLoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=inline_serializer(
            name="StudentLoginSerializer",
            fields={
                "student_id": serializers.CharField(),
                "password": serializers.CharField(write_only=True),
            },
        ),
        responses={200: ...},
    )

    def post(self, request):
        student_id = request.data.get("student_id")
        password = request.data.get("password")

        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Invalid student ID"}, status=400)

        # Check password against hashed one from StudentCredential
        if not check_password(password, student.credential.password):
            return Response({"error": "Invalid password"}, status=400)

        token_obj, created = StudentToken.objects.get_or_create(student=student)
 
        return Response({
            "message": "Login successful",
            "student_id": student.student_id,
            "token": token_obj.token,
            "student_id": student.student_id,
            "name": student.student_name,
            "degree_program": student.degree_program.program_name,
            "semester": student.semester,
            "section": student.section,
        })
    





@extend_schema(tags=["Student's APIs"])
class GetTodayStudentSchedulesView(APIView):
    authentication_classes = [StudentTokenAuth]
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id, degree_program, semester, *args, **kwargs):
        if not student_id:
            return Response({"error": "Student ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            degree_program_obj = DegreeProgram.objects.get(program_name=degree_program)
        except DegreeProgram.DoesNotExist:
            return Response({"error": "Degree program not found."}, status=status.HTTP_404_NOT_FOUND)

        today = date.today()

        # Check if class has started
        class_exists = Classroom.objects.filter(
            degree_program=degree_program_obj,
            semester=semester,
            start_time__date=today,
            end_time__isnull=True
        ).exists()

        # Get today's schedules
        schedules = GeneratedSchedule.objects.select_related('teacher', 'course', 'degree_program').filter(
            degree_program=degree_program_obj,
            semester=semester,
            lecture_date=today
        )

        # Prefetch attendance for performance
        student_attendance = Attendance.objects.filter(student=student, date=today)
        attendance_map = {
            attendance.schedule_id: attendance.status == "Present"
            for attendance in student_attendance
        }

        # Build schedule list with attendance status per schedule
        schedule_list = [
            {
                "schedule_id": sched.id,
                "teacher_id": sched.teacher.id,
                "teacher_name": sched.teacher.teacher_name,
                "teaching_type": sched.teacher.teaching_type,
                "degree_program": sched.degree_program.program_name,
                "semester": sched.semester,
                "course_name": sched.course.course_name,
                "lecture_date": sched.lecture_date,
                "start_time": sched.start_time,
                "end_time": sched.end_time,
                "attendance_status": attendance_map.get(sched.id, False)  # default to False if no record
            }
            for sched in schedules
        ]

        return Response({
            "class_started": class_exists,
            "schedules": schedule_list
        }, status=status.HTTP_200_OK)

@extend_schema(tags=["Student's APIs"])
class GetSchedulesByCourseCodeView(APIView):
    authentication_classes = [StudentTokenAuth]
    permission_classes = [IsAuthenticated]

    def get(self, request,course_code:str):
        # course_code = request.query_params.get('course_code')

        if not course_code:
            return Response(
                {"error": "course_code query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        schedules = GeneratedSchedule.objects.select_related('teacher', 'course', 'degree_program').filter(
            course__course_code=course_code
        )

        schedule_list = []
        for sched in schedules:
            schedule_list.append({
                "teacher_name": sched.teacher.teacher_name,
                "teaching_type": sched.teacher.teaching_type,
                "degree_program": sched.degree_program.program_name,
                "semester": sched.semester,
                "course_name": sched.course.course_name,
                "course_code": sched.course.course_code,
                "lecture_date": sched.lecture_date,
                "start_time": sched.start_time,
                "end_time": sched.end_time,
            })

        return Response(schedule_list, status=status.HTTP_200_OK)



# filter courses by degree program  
@extend_schema(tags=["student APIs"])
class CourseByDegreeProgramForStudents(APIView):
    authentication_classes = [StudentTokenAuth]

    permission_classes = [IsAuthenticated]

    course_serializer = CourseSerializer
    def get(self, request, degree_program=None , semester=None):
        """Retrieve a course based on the degree program."""
        try:
            courses = Course.objects.filter(degree_program__program_name__icontains=degree_program, semester=semester)
            serializer = self.course_serializer(courses, many=True)
            course_code = [course["course_code"] for course in serializer.data]
            course_names_with_teacher = {course["course_name"]: course["teacher"] for course in serializer.data}
            return Response({"course_codes":course_code,"cource_details":course_names_with_teacher}, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
