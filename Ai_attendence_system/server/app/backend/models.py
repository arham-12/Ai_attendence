from django.db import models

# Create your models here.

class DegreeProgram(models.Model):
    program_name = models.CharField(max_length=255, unique=True)  # Unique program name

    def __str__(self):
        return self.program_name

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


class Course(models.Model):
    course_name = models.CharField(max_length=255)
    course_code = models.CharField(max_length=50, unique=True)  # Course code
    course_description = models.TextField()
    course_program = models.ForeignKey(
        DegreeProgram, on_delete=models.CASCADE, related_name="courses"
    )  # Each course belongs to a degree program
    teacher = models.ForeignKey(
        'Teachers', on_delete=models.SET_NULL, null=True, blank=True, related_name="courses"
    )  # Teacher assigned to this course

    def __str__(self):
        return self.course_name


class Teachers(models.Model):
    teacher_name = models.CharField(max_length=255)
    teacher_email = models.EmailField(unique=True, null=False, blank=False)  # Email of the teacher
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

 
class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendances")  # Foreign key
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="attendances")  # Foreign key
    date = models.DateField()
    is_present = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.student} - {self.course} - {self.date}"