from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.models import Course
from backend.serializer import CourseSerializer
from drf_spectacular.utils import extend_schema,extend_schema_view



class CourseView(APIView):
    """View to handle all CRUD operations for Course."""
    course_serializer = CourseSerializer
    def get(self, request, course_code=None):
        """Retrieve a single course or all courses."""
        if course_code:
            try:
                course = Course.objects.get(course_code=course_code)
                serializer = self.course_serializer(course)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Course.DoesNotExist:
                return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            courses = Course.objects.all()
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    @extend_schema(
            request=CourseSerializer,
            description="Create a new course"
    )
    def post(self, request):
        """Create a new course."""
        serializer = self.course_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @extend_schema(request=CourseSerializer)
    def put(self, request, course_code):
        """Update an existing course."""
        try:
            course = Course.objects.get(course_code=course_code)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.course_serializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, course_code):
        """Delete a course."""
        try:
            course = Course.objects.get(course_code=course_code)
            course.delete()
            return Response({"message": "Course deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
