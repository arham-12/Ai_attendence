from  django.db import models



# Schema for DegreeProgram
class DegreeProgram(models.Model):
    program_name = models.CharField(max_length=255, unique=True)  # Unique program name

    def __str__(self):
        return self.program_name