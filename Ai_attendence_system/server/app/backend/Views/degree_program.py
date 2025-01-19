# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.Models.DegreeProgramModels import DegreeProgram
from backend.Serializers.DegreeProgramSerilizer import DegreeProgramSerializer
from drf_spectacular.utils import extend_schema,OpenApiParameter

class DegreeProgramAPIView(APIView):
    serializer_class = DegreeProgramSerializer

    def get(self, request, program_name=None):
        if program_name:
            # Fetch a specific degree program
            try:
                degree_program = DegreeProgram.objects.get(program_name=program_name)
                serializer = self.serializer_class(degree_program)
                return Response(serializer.data)
            except DegreeProgram.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Fetch all degree programs
            degree_programs = DegreeProgram.objects.all()
            
            # Extract just the program names into a list
            program_names = [program.program_name for program in degree_programs]
            
            # Serialize the full degree program data
            serializer = DegreeProgramSerializer(degree_programs, many=True)
            
            # Return both the list of program names and the serialized data
            return Response({
                "program_names": program_names,
                "degree_programs": serializer.data
            })

    @extend_schema(request=DegreeProgramSerializer)
    def post(self, request):
        # Create a new degree program
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=DegreeProgramSerializer)
    def put(self, request, program_name=None):
        if program_name:
            # Update a degree program
            try:
                degree_program = DegreeProgram.objects.get(program_name=program_name)
            except DegreeProgram.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.serializer_class(degree_program, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Program name not provided."}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, program_name=None):
        if program_name:
            # Delete a degree program
            try:
                degree_program = DegreeProgram.objects.get(program_name=program_name)
                degree_program.delete()
                return Response({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            except DegreeProgram.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "Program name not provided."}, status=status.HTTP_400_BAD_REQUEST)

