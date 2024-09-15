import 'dart:convert';
// import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import "textflield.dart";
class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _rollnoController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  String? _imageBase64;

  Future<void> _pickImageFromCamera() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.front,
    );

    if (image != null) {
      final bytes = await image.readAsBytes();
      setState(() {
        _imageBase64 = base64Encode(bytes);
      });
    }
  }

  Future<void> _registerStudent() async {
    if (_formKey.currentState!.validate()) {
      final url = Uri.parse(
          'https://yourapiurl.com/register'); // Replace with your API URL

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': _nameController.text,
          'email': _emailController.text,
          'rollno': _rollnoController.text,
          'password': _passwordController.text,
          'confirm_password': _confirmPasswordController.text,
          'image': _imageBase64,
        }),
      );

      if (response.statusCode == 200) {
        Fluttertoast.showToast(msg: 'Registration successful');
        Navigator.pop(context);
      } else {
        Fluttertoast.showToast(msg: 'Registration failed: ${response.body}');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: const Text('Student Registration'),
      //   backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      // ),
      body: Stack(
        children:[ Container(
          height: 200,
          decoration: const BoxDecoration(
            color: Colors.blue,
            // gradient: LinearGradient(
            //   colors: [Color.fromARGB(255, 2, 61, 163), Color.fromARGB(255, 30, 136, 235)], // Background gradient colors
            //   begin: Alignment.topCenter,
            //   end: Alignment.bottomCenter,
            // ),
          ),
        ),
         Container(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Center(
                        child: Text(
                          'Register',
                          style: TextStyle(fontSize: 32, color: Colors.white),
                          
                          
                        ),
                      ),
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
                        child: Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              SizedBox(height: 20),
                              buildTextField(
                                controller: _nameController,
                                label: 'Name',
                                validator: (value) {
                                  if (value!.isEmpty) return 'Name is required';
                                  return null;
                                },
                              ),
                              buildTextField(
                                controller: _emailController,
                                label: 'Email',
                                keyboardType: TextInputType.emailAddress,
                                validator: (value) {
                                  if (value!.isEmpty) return 'Email is required';
                                  if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                                    return 'Enter a valid email address';
                                  }
                                  return null;
                                },
                              ),
                              buildTextField(
                                controller: _rollnoController,
                                label: 'Roll Number',
                                validator: (value) {
                                  if (value!.isEmpty) return 'Roll number is required';
                                  return null;
                                },
                              ),
                              Row(
                                children: [
                                  Expanded(
                                    child: buildTextField(
                                      controller: _passwordController,
                                      label: 'Password',
                                      obscureText: true,
                                      validator: (value) {
                                        if (value!.isEmpty)
                                          return 'Password is required';
                                        if (value.length < 8)
                                          return 'Password must be at least 8 characters';
                                        return null;
                                      },
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: buildTextField(
                                      controller: _confirmPasswordController,
                                      label: 'Confirm Password',
                                      obscureText: true,
                                      validator: (value) {
                                        if (value!.isEmpty)
                                          return 'Confirm password is required';
                                        if (value != _passwordController.text)
                                          return 'Passwords do not match';
                                        return null;
                                      },
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              _imageBase64 != null
                                  ? Image.memory(base64Decode(_imageBase64!),
                                      height: 150)
                                  : const SizedBox.shrink(),
                              ElevatedButton(
                                onPressed: _pickImageFromCamera,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors
                                      .blueAccent, // Background color of the button
                                  foregroundColor: Colors.white, // Text and icon color
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize
                                      .min, // Adjust the size of the button to fit content
                                  children: [
                                    Icon(Icons.camera_alt), // Camera icon
                                    SizedBox(width: 8), // Space between icon and text
                                    Text('Give Photo'), // Button text
                                  ],
                                ),
                              ),
                              const SizedBox(height: 20),
                              ElevatedButton(
                                onPressed: _registerStudent,
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blueAccent,
                                    foregroundColor: Colors.white),
                                child: const Text('Register'),
                              ),
                              SizedBox(height: 20),
                            ],
            
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ]
      ),
    );
  }
}

