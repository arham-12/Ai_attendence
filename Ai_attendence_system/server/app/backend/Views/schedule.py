from datetime import timedelta
from django.utils import timezone
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from backend.Models.DegreeProgramModels import DegreeProgram
from backend.Models.CourseModels import Course
from backend.Models.TeachersModels import Teachers
from backend.Models.SchedulingModels import GeneratedSchedule
from backend.Serializers.ScheduleSerializer import ScheduleInputSerializer, GeneratedScheduleSerializer
from  drf_spectacular.utils import extend_schema

class GenerateScheduleView(APIView):

    @extend_schema(request=ScheduleInputSerializer)
    def post(self, request, *args, **kwargs):
        # Validate input data
        serializer = ScheduleInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Extract validated data
        data = serializer.validated_data
        degree_program_name = data['degree_program']
        course_name = data['course']
        teacher_name = data['teacher_name']
        semester_starting_date = data['semester_starting_date']
        semester_ending_date = data['semester_ending_date']
        no_of_lectures_per_semester = data['no_of_lectures_per_semester']
        lecture_starting_time = data['lecture_starting_time']
        lecture_ending_time = data['lecture_ending_time']
        # Normalize each preferred weekday (e.g., "monday" -> "Monday")
        preferred_weekdays = [day.capitalize() for day in data['preferred_weekdays']]

        # Fetch database objects
        try:
            degree_program = DegreeProgram.objects.get(program_name=degree_program_name)
            course = Course.objects.get(course_name=course_name)
            teacher = Teachers.objects.get(teacher_name=teacher_name)
        except (DegreeProgram.DoesNotExist, Course.DoesNotExist, Teachers.DoesNotExist):
            return Response({"error": "Degree program, course, or teacher not found"},
                            status=status.HTTP_404_NOT_FOUND)

        # Initialize schedule generation
        generated_schedules = []
        current_date = semester_starting_date
        lectures_scheduled = 0

        # Loop day-by-day until we either run out of days or reach the required number of lectures.
        while current_date <= semester_ending_date and lectures_scheduled < no_of_lectures_per_semester:
            # Check if current_date's day is in the list of preferred weekdays.
            if current_date.strftime('%A') in preferred_weekdays:
                # Check for conflicts on this day.
                conflicts = GeneratedSchedule.objects.filter(
                    lecture_date=current_date
                ).filter(
                    Q(start_time__lt=lecture_ending_time, end_time__gt=lecture_starting_time) &
                    (
                        Q(degree_program=degree_program) |  # Prevent overlapping lectures in the same program
                        (Q(teacher=teacher) & ~Q(course=course))  # Allow teacher to teach different courses concurrently
                    )
                )

                if conflicts.exists():
                    conflict_details = []
                    for conflict in conflicts:
                        if conflict.teacher == teacher and conflict.course != course:
                            conflict_details.append(
                                f"Teacher {teacher.name} is already teaching {conflict.course.name} at this time."
                            )
                        if conflict.degree_program == degree_program:
                            conflict_details.append(
                                f"Degree program {degree_program.name} already has a lecture."
                            )

                    return Response(
                        {
                            "error": f"Conflict detected on {current_date} from {lecture_starting_time} to {lecture_ending_time}.",
                            "conflict_details": conflict_details,
                            "suggestion": "Please choose a different time slot or day."
                        },
                        status=status.HTTP_409_CONFLICT
                    )

                # No conflicts: create the schedule for this day.
                schedule_data = {
                    "degree_program": degree_program,
                    "course": course,
                    "teacher": teacher,
                    "lecture_date": current_date,
                    "start_time": lecture_starting_time,
                    "end_time": lecture_ending_time
                }
                generated_schedule = GeneratedSchedule.objects.create(**schedule_data)
                generated_schedules.append(generated_schedule)
                lectures_scheduled += 1

            # Move to the next day.
            current_date += timedelta(days=1)

        # If we could not schedule the desired number of lectures within the semester,
        # you may want to return a warning or error.
        if lectures_scheduled < no_of_lectures_per_semester:
            return Response(
                {"error": f"Could only schedule {lectures_scheduled} lectures before the semester ended."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Serialize and return the generated schedule data.
        response_data = GeneratedScheduleSerializer(generated_schedules, many=True).data
        return Response({"detail": "Schedule generated successfully", "schedules": response_data},
                        status=status.HTTP_201_CREATED)

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