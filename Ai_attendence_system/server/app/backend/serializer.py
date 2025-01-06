# serializers.py

from rest_framework import serializers
from .models import DegreeProgram, Student,Teachers,TeacherPasswords
from django.contrib.auth.hashers import make_password
from .models import Lecture, Schedule

class DegreeProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DegreeProgram
        fields = "__all__"

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class StudentSerializer(serializers.ModelSerializer):

    degree_program = serializers.CharField()  # Accept program_name as a string

    class Meta:
        model = Student
        fields = "__all__"

    def create(self, validated_data):
        # Extract the degree_program string and fetch the corresponding DegreeProgram object
        degree_program_name = validated_data.pop("degree_program")  # Get the program name and remove it from validated_data
        try:
            degree_program = DegreeProgram.objects.get(program_name=degree_program_name)
        except DegreeProgram.DoesNotExist:
            raise serializers.ValidationError({"detail": "Degree Program not found."})

        # Create and return the student instance
        student = Student.objects.create(degree_program=degree_program, **validated_data)  # Pass the remaining data
        return student
    
    def update(self, instance, validated_data):
        # Extract the degree_program string if provided and fetch the corresponding DegreeProgram object
        degree_program_name = validated_data.pop("degree_program", None)
        if degree_program_name:
            try:
                degree_program = DegreeProgram.objects.get(program_name=degree_program_name)
                instance.degree_program = degree_program
            except DegreeProgram.DoesNotExist:
                raise serializers.ValidationError({"detail": "Degree Program not found."})

        # Update the other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    

class TeacherSerializer(serializers.ModelSerializer):
    degree_program = serializers.CharField()  # Unified for both read and write

    class Meta:
        model = Teachers
        fields = ['teacher_name', 'teacher_email', 'degree_program']

    def to_representation(self, instance):
        """Customize representation for GET requests."""
        representation = super().to_representation(instance)
        # Replace degree_program with its name for the GET response
        representation['degree_program'] = instance.degree_program.program_name
        return representation

    def validate_degree_program(self, value):
        """Validate degree_program during POST requests."""
        try:
            program = DegreeProgram.objects.get(program_name=value)
        except DegreeProgram.DoesNotExist:
            raise serializers.ValidationError(f'Degree program "{value}" does not exist.')
        return program

    def create(self, validated_data):
        """Handle creation of Teacher with degree program."""
        degree_program = validated_data.pop('degree_program')
        validated_data['degree_program'] = self.validate_degree_program(degree_program)
        return Teachers.objects.create(**validated_data)
class TeacherPasswordSerializer(serializers.ModelSerializer):
    teacher_email = serializers.EmailField(source='teacher.teacher_email', write_only=True)

    class Meta:
        model = TeacherPasswords
        fields = ['teacher_email', 'password']

    def validate(self, data):
        # Check if the teacher email exists in the Teachers table
        teacher_email = data['teacher']['teacher_email']
        if not Teachers.objects.filter(teacher_email=teacher_email).exists():
            raise serializers.ValidationError("Teacher with the given email does not exist.")

        # Check if the password for this teacher already exists
        if TeacherPasswords.objects.filter(teacher__teacher_email=teacher_email).exists():
            raise serializers.ValidationError("Password already exists for this teacher.")
        
        return data

    def create(self, validated_data):
        teacher_email = validated_data.pop('teacher')['teacher_email']
        teacher = Teachers.objects.get(teacher_email=teacher_email)

        # Encrypt the password
        validated_data['password'] = make_password(validated_data['password'])
        
        return TeacherPasswords.objects.create(teacher=teacher, **validated_data)
    


class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = "__all__"

class ScheduleSerializer(serializers.ModelSerializer):
    lectures = LectureSerializer(many=True)

    class Meta:
        model = Schedule
        fields = "__all__"
