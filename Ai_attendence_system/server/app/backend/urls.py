from django.urls import path
from backend.Views.students import StudentAPIView, BulkStudentInsertionAPIView
from backend.Views.degree_program import DegreeProgramAPIView
from backend.Views.teachers import TeacherAPIView, TeacherPasswordView, BulkTeacherInsertionAPIView
from django.views.decorators.http import require_http_methods
from backend.Views.user import UserManagementAPIView

urlpatterns = [
    #user authentication api endpoints
    path(
        "login/",
        require_http_methods(["POST"])(UserManagementAPIView.as_view()),
        name="login",
    ),
    # Teacher API Endpoints
    path(
        "teachers/",
        require_http_methods(["GET", "POST"])(TeacherAPIView.as_view()),
        name="teacher_list_create",
    ),
    path(
        "teachers/<str:teacher_email>/",
        require_http_methods(["GET", "PUT", "DELETE"])(TeacherAPIView.as_view()),
        name="teacher_detail",
    ),
    path(
        "teachers_bulk_insertion/",
        require_http_methods(["POST"])(BulkTeacherInsertionAPIView.as_view()),
        name="teacher_bulk_insertion",
    ),

    # Teacher Password API Endpoints
    path(
        "teacher-passwords/",
        require_http_methods(["POST"])(TeacherPasswordView.as_view()),
        name="teacher_password_list_create",
    ),
    # DegreeProgram API Endpoints
    path(
        'degree-programs/',
        require_http_methods(["GET", "POST"])(DegreeProgramAPIView.as_view()),
        name='degree_program_list_create',
    ),
    path(
        'degree-programs/<str:program_name>/',
        require_http_methods(["GET", "PUT", "DELETE"])(DegreeProgramAPIView.as_view()),
        name='degree_program_detail',
    ),

    # Student API Endpoints
    path(
        'students/',
        require_http_methods(["GET", "POST"])(StudentAPIView.as_view()),
        name='student_list_create',
    ),
    path(
        'students/<str:student_id>/',
        require_http_methods(["GET", "PUT", "DELETE"])(StudentAPIView.as_view()),
        name='student_detail',
    ),
    path(
        'students_bulk_insertion/',
        require_http_methods(["POST"])(BulkStudentInsertionAPIView.as_view()),
        name='student_bulk_insertion',
    ),
]