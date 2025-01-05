from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from drf_spectacular.utils import extend_schema
from django.contrib.auth import authenticate, update_session_auth_hash
from django.contrib.auth.models import User

class UserManagementAPIView(APIView):
    permission_classes = [AllowAny]
    """
    Handles user authentication (login) and updating user credentials.
    """
    @extend_schema(
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "username": {"type": "string", "format": "email"},
                    "password": {"type": "string", "format": "password"},
                },
                "required": ["username", "password"],
            }
        },
        responses={
            200: {"type": "object", "properties": {"detail": {"type": "string"}, "access_token": {"type": "string"}}},
            400: {"type": "object", "properties": {"detail": {"type": "string"}}},
            401: {"type": "object", "properties": {"detail": {"type": "string"}}},
        },
    )
    def post(self, request):
        """
        Authenticate the user with email and password and return JWT tokens.
        """
        username = request.data.get("username")
        password = request.data.get("password")

        # Validate input
        if not username or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Authenticate user
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            # Generate JWT tokens
            token, created = Token.objects.get_or_create(user=user)
            print(token)
            print(token)
            
            return Response(
                {"detail": "Login successful.", "access_token": token.key},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
    @extend_schema(
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "new_password": {"type": "string", "format": "password"},
                    "confirm_password": {"type": "string", "format": "password"},
                },
                "required": ["new_password", "confirm_password"],
            }
        },
        responses={
            200: {"type": "object", "properties": {"detail": {"type": "string"}}},
            
        },
    )
    def put(self, request):
        """
        Update user credentials (password or other details).
        Requires authentication.
        """
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = request.user
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        # Validate passwords
        if not new_password or not confirm_password:
            return Response(
                {"detail": "Both 'new_password' and 'confirm_password' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {"detail": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update user password
        user.set_password(new_password)
        user.save()

        # Keep the user logged in after password change
        update_session_auth_hash(request, user)

        return Response(
            {"detail": "Password updated successfully."},
            status=status.HTTP_200_OK,
        )