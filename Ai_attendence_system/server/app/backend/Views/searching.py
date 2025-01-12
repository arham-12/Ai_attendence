from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.models import Student, Teachers
from drf_spectacular.utils import extend_schema, OpenApiParameter

class StudentSearchView(APIView):
    """View to search students by student_name, student_id, or student_email using case-insensitive LIKE query."""

    @extend_schema(
        parameters=[
            OpenApiParameter(name="query", type=str, location=OpenApiParameter.QUERY, description="The search query.")
        ]
    )
    def get(self, request):
        query = request.query_params.get('query', '').strip()  # Get the search query from request
        if query:
            # Perform a case-insensitive search using `icontains`
            students = Student.objects.filter(
                student_id__icontains=query  # Search for the query as a substring in the student_id field
            )

            # Return the student_ids of the matching students
            student_ids = [student.student_id for student in students]
            return Response(student_ids, status=status.HTTP_200_OK)

        return Response({"message": "Please provide a search query."}, status=status.HTTP_400_BAD_REQUEST)
    

class TeacherSearchView(APIView):
    """View to search teachers by teacher_email using a case-insensitive LIKE query."""

    @extend_schema(
        parameters=[
            OpenApiParameter(name="query", type=str, location=OpenApiParameter.QUERY, description="The search query.")
        ]
    )
    def get(self, request):
        query = request.query_params.get('query', '').strip()  # Get the search query from request

        if query:
            # Perform a case-insensitive search using `icontains` for teacher_email
            teachers = Teachers.objects.filter(
                teacher_email__icontains=query  # Search by teacher_email field
            )

            # Return the list of teacher emails that matched the query
            teacher_emails = [teacher.teacher_email for teacher in teachers]
            return Response(teacher_emails, status=status.HTTP_200_OK)

        return Response({"message": "Please provide a search query."}, status=status.HTTP_400_BAD_REQUEST)