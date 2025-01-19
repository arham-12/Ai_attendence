from rest_framework import serializers
from  backend.Models.TeachersModels import Teachers, TeacherPasswords
from  backend.Models.DegreeProgramModels import DegreeProgram
from  django.contrib.auth.hashers import make_password




class TeacherSerializer(serializers.ModelSerializer):
    # Define possible choices for teaching_type
    TEACHING_TYPE_CHOICES = [
        ('permanent', 'Permanent'),
        ('visitor', 'Visitor'),
    ]
    
    # Using the ChoiceField to restrict values to 'permanent' or 'visitor'
    teaching_type = serializers.ChoiceField(choices=TEACHING_TYPE_CHOICES, required=False)
    degree_program = serializers.CharField()  # Unified for both read and write

    class Meta:
        model = Teachers
        fields = "__all__"

    def to_representation(self, instance):
        """Customize representation for GET requests."""
        representation = super().to_representation(instance)
        
        # Replace degree_program with its name
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
        """Handle creation of a teacher."""
        degree_program = validated_data.pop('degree_program')
        teaching_type = validated_data.pop('teaching_type', 'visitor')  # Default to 'visitor' if not provided
        
        # Create teacher
        teacher = Teachers.objects.create(
            degree_program=degree_program,
            teaching_type=teaching_type,
            **validated_data
        )
        
        return teacher

    def update(self, instance, validated_data):
        """Handle updating a teacher."""
        teaching_type = validated_data.pop('teaching_type', None)
        degree_program = validated_data.pop('degree_program', None)
        
        # Update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if degree_program:
            instance.degree_program = degree_program
        if teaching_type:
            instance.teaching_type = teaching_type
        
        instance.save()
        
        return instance

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
    