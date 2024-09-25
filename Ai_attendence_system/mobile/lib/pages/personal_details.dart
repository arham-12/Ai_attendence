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
      appBar: AppBar(title: Text('Personal Details')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            CustomTextField(
              label: 'Name',
              onChanged: (value) => controller.name.value = value,
            ),
            CustomTextField(
              label: 'Email',
              onChanged: (value) => controller.email.value = value,
            ),
            CustomTextField(
              label: 'Password',
              obscureText: true,
              onChanged: (value) => controller.password.value = value,
            ),
            CustomTextField(
              label: 'Confirm Password',
              obscureText: true,
              onChanged: (value) => controller.confirmPassword.value = value,
            ),
            ElevatedButton(
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
        ),
      ),
    );
  }
}
// 