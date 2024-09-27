import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controlors/form_controller.dart';
import '../widgets/custom_text_field.dart';
// import 'academic_details.dart'; // Importing the Academic Details Page

class PersonalDetailsPage extends StatelessWidget {
  final PageController pageController;
  final FormController controller = Get.put(FormController());

  PersonalDetailsPage({required this.pageController});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      // appBar: AppBar(title: Text('Personal Details')),
      body: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              // boxShadow: [
              //   BoxShadow(
              //     color: Colors.grey.withOpacity(0.5),
              //     spreadRadius: 2,
              //     blurRadius: 5,
              //     offset: Offset(0, 3),
              //   ),
              // ],
            ),
            child: Column(
                children: [
                  Column(
                    children: [
                      Container(
                        width: 150,
                        height: 45,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          color: Theme.of(context).colorScheme.primary,
                        ),
                                      
                          // padding: const EdgeInsets.all(8.0),
                          child: Center(child: Text('Personal Details', style: Theme.of(context).textTheme.bodyLarge,)),
                      
                      ),
                    ],
                  ),
                  Column(
                    children: [
                       SizedBox(height: 16),
                  CustomTextField(
                    label: 'Name',
                    keyboardType: TextInputType.name,
                    onChanged: (value) => controller.name.value = value,
                  ),
                  CustomTextField(
                    label: 'Email',
                    keyboardType: TextInputType.emailAddress,
                    onChanged: (value) => controller.email.value = value,
                  ),
                  CustomTextField(
                    label: 'Password',
                    keyboardType: TextInputType.visiblePassword,
                    obscureText: true,
                    onChanged: (value) => controller.password.value = value,
                  ),
                  CustomTextField(
                    label: 'Confirm Password',
                    keyboardType: TextInputType.visiblePassword,
                    obscureText: true,
                    onChanged: (value) => controller.confirmPassword.value = value,
                  ),
                  SizedBox(height: 16),
                  ElevatedButton(
                    style: Theme.of(context).elevatedButtonTheme.style,
                    onPressed: () {
                      if (controller.isPersonalDetailsValid()) {
                        pageController.nextPage(
                          duration: Duration(milliseconds: 300),
                          curve: Curves.easeIn,
                        );
                      } else {
                        Get.snackbar('Error', 'Please fill all fields correctly.');
                      }
                    },
                    child: Text('Next'),
                  ),
                      
                    ],
                  )
                 
                ],
              ),
            ),
        
    
      );
    
  }
}
// 