from django.contrib import admin
from .models import Attendance, Course, DegreeProgram, Student, Teachers

# Register your models here.
admin.site.register(DegreeProgram)
admin.site.register(Course)
admin.site.register(Teachers)
admin.site.register(Attendance)
admin.site.register(Student)
