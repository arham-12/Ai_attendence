from  django.db import models
from  backend.models.DegreeProgramModels import DegreeProgram
import secrets
from django.contrib.auth.models import AbstractUser

class Teachers(models.Model):
    teacher_name = models.CharField(max_length=255)
    teacher_email = models.EmailField(unique=True, null=False, blank=False)
    teaching_type = models.CharField(max_length=255, null=True, blank=True, default="visitor")
    degree_program = models.ForeignKey(
        DegreeProgram, related_name="teachers", on_delete=models.CASCADE, default=1
    )
    
        # Mock 'is_authenticated' property
    @property
    def is_authenticated(self):
        return True
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
    

class TeacherToken(models.Model):
    teacher = models.OneToOneField('Teachers', on_delete=models.CASCADE)
    token = models.CharField(max_length=40, unique=True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_hex(20)
        super().save(*args, **kwargs)