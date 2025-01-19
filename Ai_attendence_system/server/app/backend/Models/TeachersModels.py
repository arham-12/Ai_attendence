from  django.db import models
from  backend.Models.DegreeProgramModels import DegreeProgram

class Teachers(models.Model):
    teacher_name = models.CharField(max_length=255)
    teacher_email = models.EmailField(unique=True, null=False, blank=False)
    teaching_type = models.CharField(max_length=255, null=True, blank=True,default="visitor")  # Optional field for teaching type
      # Email of the teacher
    degree_program = models.ForeignKey(
        DegreeProgram, related_name="teachers", on_delete=models.CASCADE, default=1
    )  # Provide a default DegreeProgram ID

    def __str__(self):
        return self.teacher_name

class TeacherPasswords(models.Model):
    teacher = models.OneToOneField(
        Teachers,
        on_delete=models.CASCADE,
        related_name='password_details',  # Access password via `teacher.password_details`
    )
    password = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return f"Password for {self.teacher.teacher_name}"  