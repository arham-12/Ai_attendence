from rest_framework import serializers
from backend.models.StudentsModels import Student
from backend.models.DegreeProgramModels import DegreeProgram
from backend.models.StudentsModels import StudentRegistration,StudentCredential
from django.contrib.auth.hashers import make_password
from django.core.files.storage import default_storage
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
    
from rest_framework import serializers

class StudentRegistrationSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    face_image = serializers.ImageField()

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        
        try:
            student = Student.objects.get(student_id=data['student_id'])
        except Student.DoesNotExist:
            raise serializers.ValidationError("Invalid student ID.")
        
        if hasattr(student, 'credential'):
            raise serializers.ValidationError("Credentials already exist for this student.")
        
        data['student'] = student
        return data

    def create(self, validated_data):


        student = validated_data['student']
        password = make_password(validated_data['password'])
        image = validated_data['face_image']

        # Save image to media/student_faces/<student_id>/face.jpg
        path = f"student_faces/{student.student_id}.jpg"
        full_path = default_storage.save(path, image)

        # Save credentials to DB
        StudentCredential.objects.create(
            student=student,
            password=password,
        )

        return {
            "message": "Registration successful",
            "image_saved_at": full_path
        }


class StudentLoginSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    password = serializers.CharField(write_only=True)