import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart' as getx; // Aliased GetX import
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'textfield.dart';

class RegisterController extends getx.GetxController {
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final rollnoController = TextEditingController();
  final degreeController = TextEditingController();
  final sectionController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  getx.RxString imagePath = ''.obs;
  getx.RxInt currentStep = 0.obs;

  final ImagePicker _picker = ImagePicker();
  final PageController pageController = PageController();

  Future<void> pickImageFromCamera() async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.front,
    );

    if (image != null) {
      imagePath.value = image.path;
    }
  }

  bool isStepValid(int step) {
    switch (step) {
      case 0:
        return nameController.text.isNotEmpty && emailController.text.isNotEmpty;
      case 1:
        return rollnoController.text.isNotEmpty && passwordController.text.isNotEmpty;
      case 2:
        return imagePath.value.isNotEmpty;
      default:
        return false;
    }
  }

  Future<void> registerStudent() async {
    if (passwordController.text != confirmPasswordController.text) {
      Fluttertoast.showToast(msg: 'Passwords do not match');
      return;
    }

    try {
      Dio dio = Dio();
      FormData formData = FormData.fromMap({
        'name': nameController.text,
        'email': emailController.text,
        'rollno': rollnoController.text,
        'password': passwordController.text,
        'confirm_password': confirmPasswordController.text,
        if (imagePath.value.isNotEmpty)
          'image': await MultipartFile.fromFile(imagePath.value, filename: 'image.jpg'),
      });

      Response response = await dio.post(
        'https://yourapiurl.com/register', // Replace with your API URL
        data: formData,
      );

      if (response.statusCode == 200) {
        Fluttertoast.showToast(msg: 'Registration successful');
        getx.Get.offAllNamed('/home'); // Navigate to home page after success
      } else {
        Fluttertoast.showToast(msg: 'Registration failed: ${response.statusMessage}');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: 'Error: $e');
    }
  }
}

class RegisterPage extends StatelessWidget {
  final RegisterController controller = getx.Get.put(RegisterController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Theme(
        data: ThemeData(
          colorScheme: ColorScheme.light(primary: Colors.blueAccent), // Change this to your desired color
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blueAccent, // Change button color here
              foregroundColor: Colors.white, // Change text color here
            ),
          ),
        ),
        child: Stack(
          children:[Container(
          height: 300,
          // width: 700,
          decoration: const BoxDecoration(
            color: Colors.blue,
            // gradient: LinearGradient(
            //   colors: [Color.fromARGB(255, 2, 61, 163), Color.fromARGB(255, 30, 136, 235)], // Background gradient colors
            //   begin: Alignment.topCenter,
            //   end: Alignment.bottomCenter,
            // ),
            
          ),
          // child: Center(child: Text('Rigister' ,style: TextStyle(color: Colors.white,fontSize: 30),)),
        ),
            Column(
              children: [ 
                SizedBox(height: 30),
                Text("Register ",style: TextStyle(color: Colors.white,fontSize: 30),),
                SizedBox(height: 20),
                Center(
                child: Container(
                  
                  padding: EdgeInsets.all(20),
                  height: 450,
                  width: 500,
                  decoration: BoxDecoration( color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow:[BoxShadow(color: Colors.black12,
                                  blurRadius: 8,
                                  offset: Offset(0, 4)),]
                  ),
                  child: Center(
                    child: Column(  
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        SizedBox(height: 10),
                    
                        Container(
                          // color: Colors.blue,
                          height: 50,
                          // color: Colors.blueAccent,
                          width: double.infinity,
                          padding: EdgeInsets.symmetric(horizontal: 10),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              StepperComponent(
                                currentIndex: controller.currentStep.value,
                                index: 0,
                                onTap: () {
                                  controller.currentStep.value = 0;
                                  controller.pageController.jumpToPage(0);
                                },
                              ),
                              StepperComponent(
                                currentIndex: controller.currentStep.value,
                                index: 1,
                                onTap: () {
                                  controller.currentStep.value = 1;
                                  controller.pageController.jumpToPage(1);
                                },
                              ),
                              StepperComponent(
                                currentIndex: controller.currentStep.value,
                                index: 2,
                                isLast: true,
                                onTap: () {
                                  controller.currentStep.value = 2;
                                  controller.pageController.jumpToPage(2);
                                },
                              ),
                            ],
                          ),
                        ),
                        SizedBox(height: 10),
                        Expanded(
                          child: PageView.builder(
                            physics: NeverScrollableScrollPhysics(),
                            controller: controller.pageController,
                            itemCount: 3,
                            itemBuilder: (context, index) {
                              if (index == 0) {
                                return buildPersonalDetailsStep();
                              } else if (index == 1) {
                                return buildAcademicDetailsStep();
                              } else {
                                return buildImageUploadStep();
                              }
                            },
                          ),
                        ),
                        // Container(color: Colors.blue, height: 5,width: 5,),
                        buildStepperControls(context),
                        SizedBox(height: 10),
                      ],
                    ),
                  ),
                ),
                          ),
              ],
            ),
        
        ],
        ),
      ),

      );
  }

  Widget buildStepperControls(BuildContext context) {
    return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (controller.currentStep.value > 0)
              ElevatedButton(
                onPressed: () {
                  if (controller.currentStep.value > 0) {
                    controller.currentStep.value--;
                    controller.pageController.previousPage(
                        duration: Duration(milliseconds: 300), curve: Curves.ease);
                  }
                },
                child: const Text('Back'),
              ),
            const SizedBox(width: 8),
            ElevatedButton(
              onPressed: () {
                if (controller.isStepValid(controller.currentStep.value)) {
                  if (controller.currentStep.value < 2) {
                    controller.currentStep.value++;
                    controller.pageController.nextPage(
                        duration: Duration(milliseconds: 300), curve: Curves.ease);
                  } else {
                    controller.registerStudent();
                  }
                }
              },
              child: Text(controller.currentStep.value == 2 ? 'Submit' : 'Next'),
            ),
          ],
        );
  }

  Widget buildPersonalDetailsStep() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          buildTextField(
            label: 'Name',
            controller: controller.nameController,
            validator: (value) {
              if (value!.isEmpty) return 'Name is required';
              return null;
            },
          ),
          buildTextField(
            label: 'Email',
            controller: controller.emailController,
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value!.isEmpty) return 'Email is required';
              if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                return 'Enter a valid email';
              }
              return null;
            },
          ),
          buildTextField(
            label: 'Password',
            controller: controller.passwordController,
            obscureText: true,
            validator: (value) {
              if (value!.isEmpty) return 'Password is required';
              if (value.length < 8) return 'Password must be at least 8 characters';
              return null;
            },
          ),
          buildTextField(
            label: 'Confirm Password',
            controller: controller.confirmPasswordController,
            obscureText: true,
            validator: (value) {
              if (value!.isEmpty) return 'Confirm password is required';
              if (value != controller.passwordController.text) return 'Passwords do not match';
              return null;
            },
          ),
          
        ],
      ),
    );
  }

  Widget buildAcademicDetailsStep() {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(
        children: [
          buildTextField(
            label: 'Roll Number',
            controller: controller.rollnoController,
            validator: (value) {
              if (value!.isEmpty) return 'Roll number is required';
              return null;
            },
          ),
          buildTextField(
            label: 'Degree Program',
            controller: controller.degreeController,
            validator: (value) {
              if (value!.isEmpty) return 'Degree program is required';
              return null;
            },
          ),
          buildTextField(
            label: 'Section',
            controller: controller.sectionController,
            validator: (value) {
              if (value!.isEmpty) return 'Section is required';
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget buildImageUploadStep() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          controller.imagePath.value.isNotEmpty
              ? Image.file(File(controller.imagePath.value), height: 150)
              : const Text('No image selected'),
          ElevatedButton.icon(
            onPressed: controller.pickImageFromCamera,
            icon: const Icon(Icons.camera_alt),
            label: const Text('Pick Image'),
          ),
        ],
      ),
    );
  }
}

// ignore: must_be_immutable
class StepperComponent extends StatelessWidget {
  // index describe the position of our bubble
  int index;
  //currentIndex is index that is gonna change on Tap
  int currentIndex;
  //onTap CallBack
  VoidCallback onTap;

  bool isLast;
   StepperComponent({
    super.key,
    required this.currentIndex,
    required this.index,
     required this.onTap,
     this.isLast=false,
  });

  @override
  Widget build(BuildContext context) {
    
    //now let's remove the ligne at the end of the row but also we need to remove unnecessary padding thus we need to remove the expanded
    //widget
    return isLast?
          Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            //this is the bubble
            GestureDetector(
              onTap: onTap,
              child: Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(100),
                  color: index==currentIndex?Colors.blue:Colors.transparent,
                  border: Border.all(color: currentIndex>=index?Colors.blue: Colors.black12),
                ),
              ),
            ),
            //this the ligne
            Container(
              height: 2,
              //why index+1 we want to turn the ligne orange that precede the active bubble
              color: currentIndex>=index+1?Colors.blue:Colors.black12,
            ),
          ],
        ),
        //index+1 we dont wanna show 0 in the screen since our index will start at 0
        Text('Page ${index+1}'),
      ],
    )
        :Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              //this is the bubble
              GestureDetector(
                onTap: onTap,
                child: Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(100),
                    color: index==currentIndex?Colors.blue:Colors.transparent,
                    border: Border.all(color: currentIndex>=index?Colors.blue: Colors.black12),
                  ),
                ),
              ),
              //this the ligne
              Expanded(
                  child: Container(
                    height: 2,
                    //why index+1 we want to turn the ligne orange that precede the active bubble
                    color: currentIndex>=index+1?Colors.blue:Colors.black12,
                  )),
            ],
          ),
          //index+1 we dont wanna show 0 in the screen since our index will start at 0
          Text('Page ${index+1}'),
        ],
      ),
    );
  }
}