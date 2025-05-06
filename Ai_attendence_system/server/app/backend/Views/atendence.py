from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from backend.models.AttendenceModels import Attendance
from backend.models.StudentsModels import Student
import face_recognition
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from math import radians, cos, sin, asin, sqrt
from drf_spectacular.utils import extend_schema,OpenApiExample, inline_serializer,extend_schema_field
from rest_framework import serializers
from django.utils import timezone
from drf_spectacular.types import OpenApiTypes
from rest_framework.parsers import MultiPartParser, FormParser
from backend.models.AttendenceModels import Classroom
from backend.authentication import StudentTokenAuth,TeacherTokenAuth
from backend.models.DegreeProgramModels import DegreeProgram
from backend.models.TeachersModels import Teachers
from django.utils.dateformat import format as date_format
from rest_framework.permissions import IsAuthenticated
# 👇 Define a custom schema for the ImageField
@extend_schema_field(field=OpenApiTypes.BINARY)
class CustomImageField(serializers.ImageField):
    pass


@extend_schema(
    tags=["Attendance APIs"],
    request=inline_serializer(
        name="AttendanceMarkSerializer",
        fields={
            "student_id": serializers.CharField(),
            "image": CustomImageField(style={"base_template": "file.html"}),
            "latitude": serializers.FloatField(),
            "longitude": serializers.FloatField(),
        },
    ),
    examples=[
        OpenApiExample(
            "Example Request",
            value={
                "student_id": "ST002",
                "image": None,  # Example value for binary (image should be uploaded)
                "latitude": 28.7041,
                "longitude": 77.1025,
            },
            request_only=True,
            media_type="multipart/form-data",
        )
    ],
    responses={
        200: {
            "description": "Attendance marked successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "student_id": "ST002",
                        "status": "Present",
                        "location_verified": True,
                        "distance_from_institute_meters": 50,
                    }
                }
            }
        },
        400: {
            "description": "Bad Request",
            "content": {
                "application/json": {
                    "example": {
                        "error": "No image uploaded."
                    }
                }
            }
        },
        403: {
            "description": "Forbidden",
            "content": {
                "application/json": {
                    "example": {
                        "error": "You Are Not Physically Present In ClassRoom"
                    }
                }
            }
        },
        404: {
            "description": "Not Found",
            "content": {
                "application/json": {
                    "example": {
                        "error": "Student not found."
                    }
                }
            }
        },
    }
)
class AttendanceMarkView(APIView):
    authentication_classes = [StudentTokenAuth]

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        # 1. Get uploaded image
        uploaded_image = request.FILES.get('image')
        if not uploaded_image:
            return Response({"error": "No image uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Get student ID
        student_id = request.data.get('student_id')
        if not student_id:
            return Response({"error": "No student_id provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        classroon_id = request.data.get('classroom_id')
        try:
            classroom = Classroom.objects.get(id=classroon_id)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found."}, status=status.HTTP_404_NOT_FOUND)
        # 3. Get latitude and longitude from frontend
        latitude = classroom.latitude
        longitude = classroom.longitude

        try:
            student_lat = float(latitude)
            student_lon = float(longitude)
        except ValueError:
            return Response({"error": "Invalid latitude or longitude values."}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Geofencing Check
        distance = self.calculate_distance(student_lat, student_lon, settings.INSTITUTE_LATITUDE, settings.INSTITUTE_LONGITUDE)
        if distance > settings.GEOFENCE_RADIUS_METERS:
            return Response({"error": "You Are Not Physically Present In ClassRoom"}, status=status.HTTP_403_FORBIDDEN)

        # 5. Load registered image
        registered_image_path = f"{settings.MEDIA_ROOT}/student_faces/{student_id}.jpg"
        try:
            registered_image = face_recognition.load_image_file(registered_image_path)
            registered_encoding = face_recognition.face_encodings(registered_image)[0]
        except Exception as e:
            return Response({"error": f"Error processing registered image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 6. Handle uploaded image (save it temporarily to be used by face_recognition)
        try:
            # Save the uploaded image temporarily
            file_name = f"temp_{uploaded_image.name}"
            temp_image_path = default_storage.save(file_name, ContentFile(uploaded_image.read()))

            uploaded_image_path = default_storage.path(temp_image_path)
            uploaded_image_data = face_recognition.load_image_file(uploaded_image_path)
            uploaded_encoding = face_recognition.face_encodings(uploaded_image_data)[0]
        except Exception as e:
            return Response({"error": f"Error processing uploaded image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 7. Compare faces
        matches = face_recognition.compare_faces([registered_encoding], uploaded_encoding)
        is_present = matches[0]

        # 8. Save attendance without latitude and longitude
        Attendance.objects.create(
            student=student,
            status='Present' if is_present else 'Absent',
        )

        return Response({
            "student_id": student_id,
            "status": 'Present' if is_present else 'Absent',
            "location_verified": True,
            "distance_from_institute_meters": distance
        }, status=status.HTTP_200_OK)

    def calculate_distance(self, lat1, lon1, lat2, lon2):
        """
        Calculate haversine distance between two points in meters.
        """
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * asin(sqrt(a))
        r = 6371000  # Radius of earth in meters
        return c * r
    
@extend_schema(
        tags=["Attendance APIs"],
        request=inline_serializer(
            name="StartClassSerializer",
            fields={
                "teacher_id": serializers.IntegerField(),
                "degree_program": serializers.CharField(),
                "semester": serializers.CharField(),
                "section": serializers.CharField(),
                "latitude": serializers.FloatField(),
                "longitude": serializers.FloatField(),
            },
        ),
        responses={
            200: {
                "description": "Class started successfully.",
                "content": {
                    "application/json": {
                        "example": {
                            "message": "Class started successfully.",
                            "classroom_id": 1,
                            "start_time": "2023-10-01T12:00:00Z",
                            "students": [
                                {"id": 1, "name": "John Doe", "roll_number": "ST001"},
                                {"id": 2, "name": "Jane Smith", "roll_number": "ST002"}
                            ]
                        }
                    }
                }
            },
            400: {
                "description": "Bad Request",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Missing required fields."
                        }
                    }
                }
            },
            404: {
                "description": "Not Found",
                "content": {
                    "application/json": {
                        "example": {
                            "error": "Invalid teacher ID."
                        }
                    }
                }
            },
        }
    )
class StartClassView(APIView):
    authentication_classes = [TeacherTokenAuth]
    permission_classes   = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        teacher_id = request.data.get('teacher_id')
        degree_program_name = request.data.get('degree_program')
        semester = request.data.get('semester')
        section = request.data.get('section')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        # Validate input
        if not all([teacher_id, degree_program_name, semester, section, latitude, longitude]):
            return Response(
                {"error": "Missing required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            teacher = Teachers.objects.get(id=teacher_id)
        except Teachers.DoesNotExist:
            return Response({"error": "Invalid teacher ID."}, status=status.HTTP_404_NOT_FOUND)

        try:
            degree_program = DegreeProgram.objects.get(program_name=degree_program_name)
        except DegreeProgram.DoesNotExist:
            return Response({"error": "Invalid degree program ID."}, status=status.HTTP_404_NOT_FOUND)

        # Create the Classroom entry
        classroom = Classroom.objects.create(
            teacher=teacher,
            degree_program=degree_program,
            semester=semester,
            section=section,
            latitude=latitude,
            longitude=longitude
        )

        # Filter students
        students = Student.objects.filter(
            degree_program=degree_program,
            semester=semester,
            section=section
        )

        # Format student data
        student_data = [
            {
                "id": student.id,
                "name": student.student_name,
                "roll_number": student.student_id
            }
            for student in students
        ]

        return Response({
            "message": "Class started successfully.",
            "classroom_id": classroom.id,
            "start_time": date_format(classroom.start_time, 'Y-m-d H:i:s'),  # or use .isoformat() if preferred
            "students": student_data
        }, status=status.HTTP_200_OK)
    

class EndClassView(APIView):
    authentication_classes = [TeacherTokenAuth]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        classroom_id = request.data.get('classroom_id')

        # Validate input
        if not classroom_id:
            return Response(
                {"error": "Missing required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            classroom = Classroom.objects.get(id=classroom_id)
        except Classroom.DoesNotExist:
            return Response({"error": "Invalid classroom ID."}, status=status.HTTP_404_NOT_FOUND)

        # Set the end time of the class
        classroom.end_time = timezone.now()
        classroom.save()

        return Response({
            "message": "Class ended successfully.",
            "end_time": date_format(classroom.end_time, 'Y-m-d H:i:s')  # or use .isoformat() if needed
        }, status=status.HTTP_200_OK)