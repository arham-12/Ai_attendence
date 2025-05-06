from django.db import models
from  backend.models.DegreeProgramModels import DegreeProgram
from django.contrib.auth.hashers import make_password, check_password
import secrets


class Student(models.Model):
    student_name = models.CharField(max_length=255)
    student_id = models.CharField(max_length=50, unique=True)  # Roll number of the student
    student_email = models.EmailField(unique=True, null=False, blank=False)  # Email of the student
    degree_program = models.ForeignKey(DegreeProgram, on_delete=models.CASCADE, related_name='students', null=True)  # ForeignKey to DegreeProgram
    semester = models.IntegerField(default=1)  # Semester of the student
    section = models.CharField(max_length=10, null=True, blank=True)  # Optional field for section
    
    @property
    def is_authenticated(self):
        return True
    def __str__(self):
        return f"{self.student_name} ({self.student_id})"

    def get_degree_program(self):
        """Helper method to fetch the DegreeProgram instance."""
        return self.degree_program
    

class StudentCredential(models.Model):
    student = models.OneToOneField('Student', on_delete=models.CASCADE, related_name='credential')
    password = models.CharField(max_length=255)

    def __str__(self):
        return f"Credential for {self.student.student_name}"

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class StudentRegistration(models.Model):
    student = models.OneToOneField('Student', on_delete=models.CASCADE, related_name='registration')
    face_image = models.ImageField(upload_to='student_images/')  # We'll override this path in serializer

    def __str__(self):
        return f"Registration info for {self.student.student_name}"



class StudentToken(models.Model):
    student = models.OneToOneField('Student', on_delete=models.CASCADE)
    token = models.CharField(max_length=40, unique=True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_hex(20)
        super().save(*args, **kwargs)