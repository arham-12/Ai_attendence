from rest_framework import serializers
from backend.Models.CourseModels import Course
from backend.Models.DegreeProgramModels import DegreeProgram
from backend.Models.TeachersModels import Teachers



class CourseSerializer(serializers.ModelSerializer):
    degree_program = serializers.CharField()  # Use degree program name for both read and write
    teacher = serializers.CharField(allow_null=True, required=False)  # Use teacher name for both read and write

    class Meta:
        model = Course
        fields = ['id', 'course_name', 'course_code','semester', 'degree_program', 'teacher']

    def to_representation(self, instance):
        """Customize representation for GET requests."""
        representation = super().to_representation(instance)
        # Replace degree_program with its name
        representation['degree_program'] = instance.degree_program.program_name
        # Replace teacher with their name or None
        representation['teacher'] = instance.teacher.teacher_name if instance.teacher else None
        return representation

    def validate_degree_program(self, value):
        """Validate degree_program during POST/PUT requests."""
        try:
            program = DegreeProgram.objects.get(program_name=value)
        except DegreeProgram.DoesNotExist:
            raise serializers.ValidationError(f'Degree program "{value}" does not exist.')
        return program

    def validate_teacher(self, value):
        """Validate teacher during POST/PUT requests."""
        if not value:
            return None
        try:
            teacher = Teachers.objects.get(teacher_name=value)
        except Teachers.DoesNotExist:
            raise serializers.ValidationError(f'Teacher "{value}" does not exist.')
        return teacher

    def create(self, validated_data):
        """Handle creation of a course."""
        degree_program = validated_data.pop('degree_program')
        teacher = validated_data.pop('teacher', None)

        # Create the course with validated data
        course = Course.objects.create(
            degree_program=degree_program,
            teacher=teacher,
            **validated_data
        )
        return course

    def update(self, instance, validated_data):
        """Handle updating a course."""
        degree_program = validated_data.pop('degree_program', None)
        teacher = validated_data.pop('teacher', None)

        if degree_program:
            instance.degree_program = degree_program
        if teacher or teacher is None:
            instance.teacher = teacher

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
