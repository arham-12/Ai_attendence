from django.urls import path
from django.views.decorators.http import require_http_methods
from backend.Views.user import UserManagementAPIView
# from  backend.Views.schedule import GenerateScheduleView
from  backend.Views.course import CourseView,CourseByDegreeProgram
from  backend.Views.searching import DegreeProgramSuggestionView
from backend.Views.students import(
    StudentAPIView,
    StudentCountView,
    BulkStudentInsertionAPIView
)
from backend.Views.degree_program import DegreeProgramAPIView
from backend.Views.teachers import(
    TeacherAPIView,
    TeacherPasswordView,
    TeacherDegreeProgramView,
    TeacherCountView,
    BulkTeacherInsertionAPIView
) 

from  backend.Views.schedule import GenerateScheduleView, GetFilteredScheduleView

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
    path(
        "filter-teachers/<str:degree_program>/",
        require_http_methods(["GET"])(TeacherDegreeProgramView.as_view()),
        name="teacher_degree_program",
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
        require_http_methods(["POST","GET"])(GenerateScheduleView.as_view()),
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
    # DegreeProgramSuggestion  API Endpoints
    path(
        "program-suggestion/",
        require_http_methods(["GET"])(DegreeProgramSuggestionView.as_view()),
        name="degree_program_suggestion",
    ),
    path(
        "student-count/",
        require_http_methods(["GET"])(StudentCountView.as_view()),
        name="student_count",
    ),
    path(
        "teacher-count/",
        require_http_methods(["GET"])(TeacherCountView.as_view()),
        name="teacher_count",
    ),
    path(
        "course-by-degree-program/<str:degree_program>/<int:semester>/",
        require_http_methods(["GET"])(CourseByDegreeProgram.as_view()),
        name="course_by_degree_program",
    ),
    path(
        "filtered-schedule/<str:degree_program>/<int:semester>/<str:teacher_name>/",
        require_http_methods(["GET"])(GetFilteredScheduleView.as_view()),
        name="filtered_schedule",
    )
]
