from  rest_framework import serializers
from backend.models.SchedulingModels import GeneratedSchedule




# Serializer for accepting input but not saving to the database
class ScheduleInputSerializer(serializers.Serializer):
    degree_program = serializers.CharField(max_length=100)
    semester= serializers.IntegerField()
    course = serializers.CharField(max_length=100)
    teacher_name = serializers.CharField(max_length=100)
    semester_starting_date = serializers.DateField()
    semester_ending_date = serializers.DateField()
    no_of_lectures_per_semester = serializers.IntegerField()
    lecture_starting_time = serializers.TimeField(format="%H:%M:%S")
    lecture_ending_time = serializers.TimeField(format="%H:%M:%S")
    preferred_weekdays = serializers.ListField(
        child=serializers.CharField(max_length=20),
        help_text="List of preferred weekdays, e.g., ['Monday', 'Wednesday']"
    )


class GeneratedScheduleSerializer(serializers.ModelSerializer):
    degree_program = serializers.CharField(source="degree_program.program_name", read_only=True)
    course = serializers.CharField(source="course.course_name", read_only=True)
    teacher = serializers.CharField(source="teacher.teacher_name", read_only=True)

    class Meta:
        model = GeneratedSchedule
        fields = ['id', 'degree_program','semester', 'course', 'teacher', 'lecture_date', 'start_time', 'end_time', 'created_at']