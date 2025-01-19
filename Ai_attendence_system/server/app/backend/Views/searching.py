# views.py
from django.http import JsonResponse
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema,OpenApiParameter
# List of degree programs
degree_programs = [
    "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
    "Bachelor of Dental Surgery (BDS)",
    "Doctor of Physical Therapy (DPT)",
    "Pharmacy (Pharm.D)",
    "Bachelor of Science in Engineering (B.Sc. Engg.)",
    "Bachelor of Science in Computer Science (BSCS)",
    "Bachelor of Software Engineering (BSSE)",
    "Bachelor of Science in Information Technology (BSIT)",
    "Master of Science in Computer Science (MSCS)",
    "Bachelor of Business Administration (BBA)",
    "Master of Business Administration (MBA)",
    "Bachelor of Commerce (B.Com)",
    "Bachelor of Arts (BA)",
    "Bachelor of Science (B.Sc.)",
    "Master of Arts (MA)",
    "Master of Science (M.Sc.)",
    "Bachelor of Fine Arts (BFA)",
    "Bachelor of Design (B.Des)",
    "Master of Fine Arts (MFA)",
    "Bachelor of Education (B.Ed)",
    "Master of Education (M.Ed)",
    "Bachelor of Laws (LL.B)",
    "Master of Laws (LL.M)",
    "Bachelor of Science in Agriculture (B.Sc. Agri.)",
    "Doctor of Veterinary Medicine (DVM)",
    "Bachelor of Media Studies (BMS)",
    "Bachelor of Journalism (BJ)",
    "Bachelor of Science in Environmental Sciences (BSES)",
    "Master of Science in Environmental Sciences (MSES)",
    "Bachelor of Architecture (B.Arch)",
    "Bachelor of Design (B.Des)",
    "Bachelor of Science in Engineering Technology (B.Sc. Engg. Tech.)"
]

class DegreeProgramSuggestionView(APIView):
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="query",
                type=str,)
        ],
        responses={
            200: {
                "type": "object",
                "properties": {
                    "sugessted_degrees": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                }
            }
        },
    )
    def get(self, request):
        query = request.GET.get('query', '').strip()

        if not query:
            return JsonResponse({"matching_degrees": []}, status=200)

        # Perform case-insensitive matching using a list comprehension
        matching_degrees = [degree for degree in degree_programs if query.lower() in degree.lower()]

        return JsonResponse({"sugessted_degrees": matching_degrees})