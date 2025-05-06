# models.py
from django.db import models
from django.utils import timezone
from .StudentsModels import Student  # Assuming your Student model is here
from .DegreeProgramModels import DegreeProgram  # Assuming your DegreeProgram model is here
from .TeachersModels import Teachers  # Assuming your Teacher model is here
class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])

    def __str__(self):
        return f"{self.student.student_id} - {self.date} - {self.status}"
    


from django.db import models


class Classroom(models.Model):
    teacher = models.ForeignKey(Teachers, on_delete=models.CASCADE)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)  # <-- New field

    degree_program = models.ForeignKey(DegreeProgram, on_delete=models.CASCADE, related_name='classrooms', null=True, blank=True)
    semester = models.CharField(max_length=20, null=True, blank=True)
    section = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"{self.teacher.name} - {self.degree_program.name} {self.semester} {self.section}"