from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from backend.models.AttendenceModels import Attendance
from backend.models.StudentsModels import Student
import face_recognition
from  backend.models.SchedulingModels import GeneratedSchedule
from datetime import date
import pytz
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from math import radians, cos, sin, asin, sqrt ,acos
from drf_spectacular.utils import extend_schema,OpenApiExample, inline_serializer,extend_schema_field
from rest_framework import serializers
from django.utils import timezone
from datetime import datetime
from geopy.distance import geodesic
from django.utils.timezone import now
from drf_spectacular.types import OpenApiTypes
from rest_framework.parsers import MultiPartParser, FormParser
from backend.models.AttendenceModels import Classroom
from backend.authentication import StudentTokenAuth,TeacherTokenAuth
from backend.models.DegreeProgramModels import DegreeProgram
from backend.models.TeachersModels import Teachers
from django.utils.dateformat import format as date_format
from rest_framework.permissions import IsAuthenticated
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from backend.models.SchedulingModels import GeneratedSchedule
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
            "longitude": serializers.FloatField(),  # added field for classroom reference
        },
    ),
    examples=[
        OpenApiExample(
            "Example Request",
            value={
                "student_id": "ST002",
                "image": None,
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
        uploaded_image = request.FILES.get('image')
        if not uploaded_image:
            return Response({"error": "No image uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        student_id = request.data.get('student_id')
        if not student_id:
            return Response({"error": "No student_id provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        
        teacher_id = request.data.get('teacher_id')
        if not teacher_id:
            return Response({"error": "No teacher_id provided."}, status=status.HTTP_400_BAD_REQUEST)
        

        schedule_id = request.data.get('schedule_id')

        schedule = GeneratedSchedule.objects.filter(
            id=schedule_id
        ).first()

        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        try:
            student_lat = float(latitude)
            student_lon = float(longitude)
        except ValueError:
            return Response({"error": "Invalid latitude or longitude values."}, status=status.HTTP_400_BAD_REQUEST)

        student_degree_program = student.degree_program
        student_semester = student.semester
        
        classroom = Classroom.objects.filter(
            teacher_id=teacher_id,
            end_time__isnull=True
        ).order_by('-id').first()
        print(f"Classroom: {classroom.id}")

        if not classroom:
            return Response({"error": "No classroom found for the student."}, status=status.HTTP_404_NOT_FOUND)
        
        classroom_lat = classroom.latitude
        classroom_lon = classroom.longitude
        print(f"Classroom Coordinates: {classroom_lat}, {classroom_lon}")
        print(f"Student Coordinates: {student_lat}, {student_lon}")
        distance = geodesic((classroom_lat, classroom_lon), (student_lat, student_lon)).meters

        print(f"Distance: {distance:.2f} meters")
        if distance > settings.GEOFENCE_RADIUS_METERS:
            return Response({"error": f"You Are Not Physically Present In ClassRoom the distance between class and you  is {distance} meter"}, status=status.HTTP_403_FORBIDDEN)

        registered_image_path = f"{settings.MEDIA_ROOT}/student_faces/{student_id}.jpg"
        try:
            registered_image = face_recognition.load_image_file(registered_image_path)
            registered_encoding = face_recognition.face_encodings(registered_image)[0]
        except Exception as e:
            return Response({"error": f"Error processing registered image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            file_name = f"temp_{uploaded_image.name}"
            temp_image_path = default_storage.save(file_name, ContentFile(uploaded_image.read()))
            uploaded_image_path = default_storage.path(temp_image_path)

            uploaded_image_data = face_recognition.load_image_file(uploaded_image_path)
            uploaded_encoding = face_recognition.face_encodings(uploaded_image_data)[0]
        except Exception as e:
            return Response({"error": f"Error processing uploaded image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            if temp_image_path and default_storage.exists(temp_image_path):
                default_storage.delete(temp_image_path)
        matches = face_recognition.compare_faces([registered_encoding], uploaded_encoding)
        is_present = matches[0]

        Attendance.objects.create(

            student=student,
            schedule=schedule,
            status='Present' if is_present else 'Absent',
        )

        # ✅ Real-time WebSocket Notification to Teacher
        try:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"classroom_{classroom.id}",  # Group name
                {
                    'type': 'send_attendance_update',
                    'student_id': student_id,
                    'status': 'Present' if is_present else 'Absent'
                }
            )
        except Exception as e:
            # Log but don’t block response
            print(f"WebSocket error: {e}")

        return Response({
            "student_id": student_id,
            "status": 'Present' if is_present else 'Absent',
            "location_verified": True,
            "distance_from_institute_meters": distance
        }, status=status.HTTP_200_OK)

    # def calculate_distance(self, lat1, lon1, lat2, lon2):
    #     # Radius of the Earth in meters
    #     R = 6371000

    #     # Convert latitude and longitude from degrees to radians
    #     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    #     # Spherical Law of Cosines formula
    #     d = R * acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon2 - lon1))

    #     return d
    
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
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        teacher_id = request.data.get('teacher_id')
        schedule_id = request.data.get('schedule_id')
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


                # ✅ Check if schedule exists
        try:
            schedule = GeneratedSchedule.objects.get(id=schedule_id)
        except GeneratedSchedule.DoesNotExist:
            return Response({"error": "Invalid schedule ID."}, status=status.HTTP_404_NOT_FOUND)

        pakistan_tz = pytz.timezone('Asia/Karachi')
        current_time = timezone.localtime(timezone.now()).astimezone(pakistan_tz)

        # Create scheduled datetime in Pakistan timezone
        scheduled_datetime = datetime.combine(current_time.date(), schedule.start_time)

        # Ensure that the scheduled time is aware by setting its timezone (same as current_time)
        scheduled_datetime = pakistan_tz.localize(scheduled_datetime)

        # Check if current time is before scheduled start time
        if current_time < scheduled_datetime:
            return Response({
                "error": "Cannot start the class before the scheduled start time.",
                "scheduled_start_time": date_format(
                    scheduled_datetime, 'Y-m-d H:i:s'
                ),
                "current_time": date_format(current_time, 'Y-m-d H:i:s')
            }, status=status.HTTP_400_BAD_REQUEST)



        # Create the Classroom entry
        classroom = Classroom.objects.create(
            teacher=teacher,
            degree_program=degree_program,
            semester=semester,
            section=section,
            latitude=latitude,
            longitude=longitude
        )

        today = timezone.now().date()

        # Filter students
        students = Student.objects.filter(
            degree_program=degree_program,
            semester=semester,
            section=section
        )

        student_data = []
        for student in students:
            # Try to get existing attendance record for today
            attendance = Attendance.objects.filter(student=student, date=today).first()
            student_status = attendance.status if attendance else "Not Marked"

            student_data.append({
                "id": student.id,
                "name": student.student_name,
                "roll_number": student.student_id,
                "status": student_status
            })

        return Response({
            "message": "Class started successfully.",
            "classroom_id": classroom.id,
            "schedule_id":schedule_id,
            "start_time": date_format(classroom.start_time, 'Y-m-d H:i:s'),
            "students": student_data
        }, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Attendance APIs"],
    request=inline_serializer(
        name="EndClassSerializer",
        fields={
            "classroom_id": serializers.IntegerField(),
            "schedule_id": serializers.IntegerField(),  # New
        },
    ),
    responses={
        200: {
            "description": "Class ended successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Class ended successfully.",
                        "end_time": "2023-10-01T14:00:00Z"
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
                        "error": "Invalid classroom ID."
                    }
                }
            }
        },
    }
)
class EndClassView(APIView):
    authentication_classes = [TeacherTokenAuth]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        classroom_id = request.data.get('classroom_id')
        schedule_id = request.data.get('schedule_id')  # New

        # Validate input
        if not classroom_id or not schedule_id:
            return Response(
                {"error": "Missing required fields (classroom_id or schedule_id)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            classroom = Classroom.objects.get(id=classroom_id)
        except Classroom.DoesNotExist:
            return Response({"error": "Invalid classroom ID."}, status=status.HTTP_404_NOT_FOUND)

        # End the class
        pakistan_tz = pytz.timezone('Asia/Karachi')
        current_time = timezone.localtime(timezone.now()).astimezone(pakistan_tz)
        print(f"Current Time: {current_time}")
        classroom.end_time = current_time
        classroom.save()

        # Ensure Schedule is imported here
        try:
            schedule = GeneratedSchedule.objects.get(id=schedule_id)
            schedule.delete()
            schedule_deleted = True
        except GeneratedSchedule.DoesNotExist:
            schedule_deleted = False

        return Response({
            "message": "Class ended successfully.",
            "end_time": date_format(classroom.end_time, 'Y-m-d H:i:s'),
            "schedule_deleted": schedule_deleted
        }, status=status.HTTP_200_OK)