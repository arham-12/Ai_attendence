import 'package:flutter/material.dart';
import 'textflield.dart';
import 'package:get/get.dart';
class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
   final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children:[ Container(
          height: 300,
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
                          'Login',
                          style: TextStyle(fontSize: 32, color: Colors.white),
                          
                          
                        ),
                      ),
                      const SizedBox(height: 40),
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
                                controller: _passwordController,
                                label: 'Password',
                                obscureText: true,
                                validator: (value) {
                                  if (value!.isEmpty) return 'Password is required';
                                  if (value.length < 8) return 'Password must be at least 8 characters';
                                  return null;
                                },
                              ),
                              const SizedBox(height: 20),
                              ElevatedButton(
                                onPressed: (){},
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blueAccent,
                                    foregroundColor: Colors.white),
                                child: const Text('Login'),
                              ),
                              SizedBox(height: 20),
                            ],
            
                          ),
                        ),
                      ),
                      SizedBox(height: 20),
                      Center(child: TextButton(
                        onPressed: (){
                          Get.toNamed('/second');
                        }, child: Text("CREATE ACCOUNT IF YOU ARE NEW", style: TextStyle(color: Colors.blue),),)),
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
