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

    def get(self, request, *args, **kwargs):
        # Fetch all generated schedules
        schedules = GeneratedSchedule.objects.all()
        serializer = GeneratedScheduleSerializer(schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
        preferred_weekday = data['preferred_weekday'].capitalize()

        # Fetch database objects
        try:
            degree_program = DegreeProgram.objects.get(program_name=degree_program_name)
            course = Course.objects.get(course_name=course_name)
            teacher = Teachers.objects.get(teacher_name=teacher_name)
        except (DegreeProgram.DoesNotExist, Course.DoesNotExist, Teachers.DoesNotExist):
            return Response({"error": "Degree program, course, or teacher not found"}, status=status.HTTP_404_NOT_FOUND)

        # Align the starting date with the preferred weekday
        start_date = semester_starting_date
        while start_date.strftime('%A') != preferred_weekday:
            start_date += timedelta(days=1)

        # Track scheduled lectures
        generated_schedules = []
        current_date = start_date

        for _ in range(no_of_lectures_per_semester):
            if current_date > semester_ending_date:
                break  # Stop if semester ends before completing lectures

            # Check for conflicts
            conflicts = GeneratedSchedule.objects.filter(
                lecture_date=current_date
            ).filter(
                Q(start_time__lt=lecture_ending_time, end_time__gt=lecture_starting_time) & 
                (
                    Q(degree_program=degree_program) |  # Prevent overlapping in the same program
                    (Q(teacher=teacher) & ~Q(course=course))  # Allow the teacher to teach different courses
                )
            )

            if conflicts.exists():
                conflict_details = []
                for conflict in conflicts:
                    if conflict.teacher == teacher and conflict.course != course:
                        conflict_details.append(f"Teacher {teacher.name} is already teaching {conflict.course.name} at this time.")
                    if conflict.degree_program == degree_program:
                        conflict_details.append(f"Degree program {degree_program.name} already has a lecture.")

                return Response(
                    {
                        "error": f"Conflict detected on {current_date} from {lecture_starting_time} to {lecture_ending_time}.",
                        "conflict_details": conflict_details,
                        "suggestion": "Please choose a different time slot or day."
                    },
                    status=status.HTTP_409_CONFLICT
                )

            # Create the schedule if no conflicts
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

            # Move to the next week's preferred weekday
            current_date += timedelta(weeks=1)

        # Serialize and return the generated schedule data
        response_data = GeneratedScheduleSerializer(generated_schedules, many=True).data
        return Response({"detail": "Schedule generated successfully", "schedules": response_data}, status=status.HTTP_201_CREATED)

