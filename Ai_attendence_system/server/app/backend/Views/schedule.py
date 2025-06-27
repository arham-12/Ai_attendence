from datetime import timedelta
from django.utils import timezone
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from backend.models.DegreeProgramModels import DegreeProgram
from backend.models.CourseModels import Course
from backend.models.TeachersModels import Teachers
from backend.models.SchedulingModels import GeneratedSchedule
from backend.Serializers.ScheduleSerializer import ScheduleInputSerializer, GeneratedScheduleSerializer
from  drf_spectacular.utils import extend_schema
from dateutil.rrule import rrule, DAILY
from django.db import transaction
class GenerateScheduleView(APIView):
    @extend_schema(request=ScheduleInputSerializer)
    def post(self, request, *args, **kwargs):
        serializer = ScheduleInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        print(data)
        # Map names to objects
        try:
            degree_program = DegreeProgram.objects.get(program_name=data['degree_program'])
            course = Course.objects.get(course_name=data['course'])
            teacher = Teachers.objects.get(teacher_name=data['teacher_name'])
        except (DegreeProgram.DoesNotExist, Course.DoesNotExist, Teachers.DoesNotExist):
            return Response(
                {'error': 'Degree program, course, or teacher not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Prepare scheduling parameters
        start_date = data['semester_starting_date']
        end_date = data['semester_ending_date']
        total_lectures = data['no_of_lectures_per_semester']
        start_time = data['lecture_starting_time']
        end_time = data['lecture_ending_time']
        weekdays = {day.capitalize() for day in data['preferred_weekdays']}

        # Early check: are there enough days?
        possible_days = [dt.date() for dt in rrule(DAILY, dtstart=start_date, until=end_date) if dt.strftime('%A') in weekdays]
        if len(possible_days) < total_lectures:
            return Response(
                {
                    'error': (
                        f"Not enough available days: {len(possible_days)} slots for {total_lectures} lectures."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        created = []
        # Bulk transactional creation
        with transaction.atomic():
            for lecture_date in possible_days[:total_lectures]:
                # Conflict check for program or teacher
                conflicts = GeneratedSchedule.objects.filter(
                    lecture_date=lecture_date,
                    start_time__lt=end_time,
                    end_time__gt=start_time
                ).filter(
                    Q(degree_program=degree_program) |
                    Q(teacher=teacher)
                )
                if conflicts.exists():
                    for conflict in conflicts:
                        if conflict.degree_program == degree_program:
                            return Response(
                                {'error': (
                                    f"Degree program '{degree_program.program_name}' already has a lecture on {lecture_date}."
                                )},
                                status=status.HTTP_409_CONFLICT
                            )
                        if conflict.teacher == teacher and conflict.course != course:
                            return Response(
                                {'error': (
                                    f"Teacher '{teacher.teacher_name}' is already teaching '{conflict.course.course_name}' at this time on {lecture_date}."
                                )},
                                status=status.HTTP_409_CONFLICT
                            )


                schedule = GeneratedSchedule(
                    degree_program=degree_program,
                    course=course,
                    teacher=teacher,
                    lecture_date=lecture_date,
                    start_time=start_time,
                    end_time=end_time
                )
                created.append(schedule)

            # Bulk save
            GeneratedSchedule.objects.bulk_create(created)

        serialized = GeneratedScheduleSerializer(created, many=True)
        return Response(
            {'detail': 'Schedule generated successfully.', 'schedules': serialized.data},
            status=status.HTTP_201_CREATED
        )

class GetFilteredScheduleView(APIView):
    def get(self, request, degree_program, semester, teacher_name, *args, **kwargs):
        # Convert semester to integer; return an error if it fails.
        try:
            semester = int(semester)
        except ValueError:
            return Response({"error": "Invalid semester value"}, status=status.HTTP_400_BAD_REQUEST)

        # Filter using case-insensitive lookups.
        schedules = GeneratedSchedule.objects.filter(
            degree_program__program_name__iexact=degree_program,
            semester=semester,
            teacher__teacher_name__iexact=teacher_name
        )
        
        serializer = GeneratedScheduleSerializer(schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def delete(self, request, *args, **kwargs):
        # Delete all schedules
        GeneratedSchedule.objects.all().delete()
        return Response({"detail": "All schedules deleted"}, status=status.HTTP_200_OK)