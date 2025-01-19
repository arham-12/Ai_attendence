from django.db import models
from backend.Models.DegreeProgramModels import DegreeProgram
from backend.Models.CourseModels import Course
from backend.Models.TeachersModels import Teachers 



class GeneratedSchedule(models.Model):
    degree_program = models.ForeignKey(DegreeProgram, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teachers, on_delete=models.CASCADE)
    lecture_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.name} - {self.teacher.name} on {self.lecture_date}"