from rest_framework import serializers
from backend.Models.StudentsModels import Student
from backend.Models.DegreeProgramModels import DegreeProgram


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
    
