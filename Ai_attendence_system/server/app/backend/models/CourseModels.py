from  django.db import models
from  backend.models.DegreeProgramModels import DegreeProgram


class Course(models.Model):
    course_code = models.CharField(max_length=50, unique=True)  # Course code
    course_name = models.CharField(max_length=255)
    semester = models.IntegerField(default=1)   # Semester in which this course is taught
    degree_program = models.ForeignKey(
        DegreeProgram, on_delete=models.CASCADE, related_name="courses"
    )  # Each course belongs to a degree program
    teacher = models.ForeignKey(
        'Teachers', on_delete=models.SET_NULL, null=True, blank=True, related_name="courses"
    )  # Teacher assigned to this course

    def __str__(self):
        return self.course_name

