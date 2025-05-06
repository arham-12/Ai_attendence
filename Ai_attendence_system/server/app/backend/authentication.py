from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from backend.models.TeachersModels import TeacherToken
from backend.models.StudentsModels import StudentToken
from backend.models.StudentsModels import Student


class StudentTokenAuth(BaseAuthentication):
    def authenticate(self, request):
        token_key = request.META.get('HTTP_AUTHORIZATION')
        if not token_key or not token_key.startswith('Token '):
            return None

        token = token_key.split('Token ')[1]

        try:
            token_obj = StudentToken.objects.get(token=token)
            student = token_obj.student
            return (student, None)
        except StudentToken.DoesNotExist:
            raise AuthenticationFailed("Invalid token")


class TeacherTokenAuth(BaseAuthentication):
    def authenticate(self, request):
        token_key = request.META.get('HTTP_AUTHORIZATION')
        if not token_key or not token_key.startswith('Token '):
            return None

        token = token_key.split('Token ')[1]

        try:
            token_obj = TeacherToken.objects.get(token=token)
            teacher = token_obj.teacher
            # Don't manually set is_authenticated
            return (teacher, None)
        except TeacherToken.DoesNotExist:
            raise AuthenticationFailed("Invalid token")