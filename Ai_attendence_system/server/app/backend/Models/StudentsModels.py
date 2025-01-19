from django.db import models
from  backend.Models.DegreeProgramModels import DegreeProgram



class Student(models.Model):
    student_name = models.CharField(max_length=255)
    student_id = models.CharField(max_length=50, unique=True)  # Roll number of the student
    student_email = models.EmailField(unique=True, null=False, blank=False)  # Email of the student
    degree_program = models.ForeignKey(DegreeProgram, on_delete=models.CASCADE, related_name='students', null=True)  # ForeignKey to DegreeProgram
    semester = models.CharField(max_length=20)
    section = models.CharField(max_length=10, null=True, blank=True)  # Optional field for section
    
    def __str__(self):
        return f"{self.student_name} ({self.student_id})"

    def get_degree_program(self):
        """Helper method to fetch the DegreeProgram instance."""
        return self.degree_program
