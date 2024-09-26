import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dio/dio.dart';
import '../widgets/custom_text_field.dart';
import '../controlors/form_controller.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final FormController controller = Get.put(FormController());
  bool isStudent = true; // To keep track of whether the user is logging in as a student or teacher

  // Function to handle login based on selected mode
  void handleLogin() async {
    String email = controller.email.value;
    String password = controller.password.value;

    // Create Dio instance
    final dio = Dio();
    const String studentUrl = 'http://localhost:8000/login-student'; // Replace with your student login URL
    const String teacherUrl = 'https://yourbackend.com/teacher/login'; // Replace with your teacher login URL

    final String selectedUrl = isStudent ? studentUrl : teacherUrl;

    try {
      // Send API request
      final response = await dio.post(
        selectedUrl,
        data: {'email': email, 'password': password},
        options: Options(headers: {'Content-Type': 'application/json'}),
      );

            // Check response status and handle accordingly
      if (response.statusCode == 200) {
        // Parse the response data
        final data = response.data;
        final String status = data['status']; // Retrieve role from the response

        if (status == 'student') {
          Get.snackbar('success', 'Login successful');
          // Navigate to the student dashboard
          // Get.offAll(() => StudentDashboard()); // Use your student page here
        } else if (status == 'teacher') {
          // Navigate to the teacher dashboard
          // Get.offAll(() => TeacherDashboard()); // Use your teacher page here
        } else {
          // Handle unexpected roles
          print('Invalid role received from server');
        }
      } else {
        // Handle errors (invalid credentials, etc.)
        print('Error: ${response.statusMessage}');
      }

    } catch (e) {
      // Handle request errors
      print('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.blue[50],
        child: Stack(
          children: [
            Container(
              height: MediaQuery.of(context).size.height / 3,
              decoration: const BoxDecoration(
                color: Colors.blue,
              ),
            ),
            Container(
              margin: EdgeInsets.only(
                top: MediaQuery.of(context).size.height / 8,
              ),
              child: ListView(
                children: [
                  Center(
                    child: Text(
                      'Login',
                      style: TextStyle(fontSize: 32, color: Colors.white),
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Toggle button for selecting Student or Teacher
                  
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    margin: const EdgeInsets.symmetric(horizontal: 32),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 8,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        const SizedBox(height: 20),
                        Center(
                    child: ToggleButtons(
                      borderRadius: BorderRadius.circular(10),
                      fillColor: Colors.blue[100],
                      selectedColor: Colors.blue,
                      color: Colors.black,
                      isSelected: [isStudent, !isStudent],
                      onPressed: (index) {
                        setState(() {
                          isStudent = index == 0;
                        });
                      },
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Text('Student'),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Text('Teacher'),
                        ),
                      ],
                    ),
                  ),
                        const SizedBox(height: 20),
                        CustomTextField(
                          onChanged: (value) => controller.email.value = value,
                          label: 'Email',
                          keyboardType: TextInputType.emailAddress,
                        ),
                        CustomTextField(
                          onChanged: (value) => controller.password.value = value,
                          label: 'Password',
                          keyboardType: TextInputType.visiblePassword,
                          obscureText: true,
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: handleLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blueAccent,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Login'),
                        ),
                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Center(
                    child: TextButton(
                      onPressed: () {
                        Get.toNamed('/second');
                      },
                      child: Text(
                        "CREATE ACCOUNT IF YOU ARE NEW",
                        style: TextStyle(color: Colors.blue),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
