from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from backend.models import Schedule, Lecture
from drf_spectacular.utils import extend_schema
from backend.serializer import ScheduleSerializer
from django.db.models import Q

class GenerateScheduleView(APIView):
    @extend_schema(request=ScheduleSerializer)
    def post(self, request):
        try:
            start_date = datetime.strptime(request.data['start_date'], "%Y-%m-%d")
            end_date = datetime.strptime(request.data['end_date'], "%Y-%m-%d")
            starting_time = datetime.strptime(request.data['starting_time'], '%I:%M %p').time()
        except ValueError:
            raise ValidationError("Invalid date format. Use 'YYYY-MM-DD'.")

        if start_date >= end_date:
            raise ValidationError("Start date must be before end date.")
        
        if request.data['num_lectures'] <= 0:
            raise ValidationError("Number of lectures must be positive.")
        
        preferred_weekdays = request.data.get('preferred_weekdays', ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
        valid_weekdays = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
        
        if not all(day in valid_weekdays for day in preferred_weekdays):
            raise ValidationError("Invalid weekday(s) provided.")

        current_date = start_date
        lecture_dates = []
        lecture_days = []
        
        while len(lecture_dates) < request.data['num_lectures'] and current_date <= end_date:
            if current_date.strftime("%A") in preferred_weekdays:
                lecture_dates.append(current_date.strftime("%Y-%m-%d"))
                lecture_days.append(current_date.strftime("%A"))
            current_date += timedelta(days=1)

        if len(lecture_dates) < request.data['num_lectures']:
            raise ValidationError("Could not schedule all lectures within the given time range and weekday constraints.")
        
        # Check for scheduling conflicts with the instructor's existing schedules
        conflicts = Schedule.objects.filter(
            Q(instructor_id=request.data['instructor_id']),
            Q(lectures__date__in=lecture_dates)
        ).exists()
        
        if conflicts:
            raise ValidationError("Scheduling conflict detected with existing schedule.")
        
        # Add the new schedule if no conflicts are detected
        new_schedule = Schedule(
            instructor_name=request.data['instructor_name'],
            instructor_id=request.data['instructor_id'],
            degree_program=request.data['degree_program'],
            semester=request.data['semester'],
            course_name=request.data['course_name'],
            course_code=request.data['course_code'],
            class_type=request.data['class_type'],
        )
        
        new_schedule.save()

        # Add lecture details
        for date, day in zip(lecture_dates, lecture_days):
            lecture = Lecture(date=datetime.strptime(date, "%Y-%m-%d"), day=day, schedule=new_schedule, starting_time=starting_time)
            lecture.save()

        # Serialize and return the response
        schedule_data = ScheduleSerializer(new_schedule)
        return Response(schedule_data.data, status=status.HTTP_201_CREATED)