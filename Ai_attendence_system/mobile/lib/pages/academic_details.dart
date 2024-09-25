import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controlors/form_controller.dart';
import '../widgets/custom_text_field.dart';
// import 'give_image.dart'; // Importing the Give Image Page

class AcademicDetailsPage extends StatelessWidget {
  final PageController pageController;
  final FormController controller = Get.find<FormController>();

  AcademicDetailsPage({required this.pageController});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Academic Details')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            CustomTextField(
              label: 'Degree Program',
              onChanged: (value) => controller.degreeProgram.value = value,
            ),
            CustomTextField(
              label: 'Roll No',
              onChanged: (value) => controller.rollNo.value = value,
            ),
            CustomTextField(
              label: 'Section',
              onChanged: (value) => controller.section.value = value,
            ),
            ElevatedButton(
              onPressed: () {
                if (controller.isAcademicDetailsValid()) {
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
