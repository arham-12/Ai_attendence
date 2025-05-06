from django.contrib import admin
from  backend.models.DegreeProgramModels import DegreeProgram
from  backend.models.CourseModels import Course
from  backend.models.TeachersModels import Teachers
# from  backend.Models.AttendanceModels import Attendance
from  backend.models.StudentsModels import Student
from  backend.models.SchedulingModels import GeneratedSchedule

# Register your models here.
admin.site.register(DegreeProgram)
admin.site.register(Course)
admin.site.register(Teachers)
admin.site.register(GeneratedSchedule)
# admin.site.register(Attendance)
admin.site.register(Student)
