from django.contrib import admin
from  backend.Models.DegreeProgramModels import DegreeProgram
from  backend.Models.CourseModels import Course
from  backend.Models.TeachersModels import Teachers
# from  backend.Models.AttendanceModels import Attendance
from  backend.Models.StudentsModels import Student
from  backend.Models.SchedulingModels import GeneratedSchedule

# Register your models here.
admin.site.register(DegreeProgram)
admin.site.register(Course)
admin.site.register(Teachers)
admin.site.register(GeneratedSchedule)
# admin.site.register(Attendance)
admin.site.register(Student)
