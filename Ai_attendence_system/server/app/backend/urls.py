from django.urls import path
from django.views.decorators.http import require_http_methods
from backend.Views.user import UserManagementAPIView
from  backend.Views.schedule import GenerateScheduleView
from  backend.Views.course import CourseView
from backend.Views.searching import StudentSearchView, TeacherSearchView
from backend.Views.students import(
    StudentAPIView,
    BulkStudentInsertionAPIView
)
from backend.Views.degree_program import DegreeProgramAPIView
from backend.Views.teachers import(
    TeacherAPIView,
    TeacherPasswordView,
    BulkTeacherInsertionAPIView
) 

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
    # Schedule API Endpoints
    path(
        "generate-schedule/",
        require_http_methods(["POST"])(GenerateScheduleView.as_view()),
        name="generate_schedule",
    ),
    # Course API Endpoints
    path(
        'courses/',
        require_http_methods(["GET", "POST"])(CourseView.as_view()),
        name='course_list_create',
    ),
    path(
        'courses/<str:course_code>/',
        require_http_methods(["GET", "PUT", "DELETE"])(CourseView.as_view()),
        name='course_detail',
    ),
    # Student search API Endpoints
    path(
        'students-search/',
        StudentSearchView.as_view(),  # No need for require_http_methods here, as it's handled by Django REST Framework
        name='student_search',
    ),
    # teacher search API Endpoints
    path(
        'teachers-search/',
        TeacherSearchView.as_view(),  # No need for require_http_methods here, as it's handled by Django REST Framework
        name='teacher_search',
    ),
]