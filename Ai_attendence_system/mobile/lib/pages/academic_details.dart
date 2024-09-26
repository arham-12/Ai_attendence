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
      // appBar: AppBar(title: Text('Academic Details')),
      body: Container(
        decoration: BoxDecoration(
          color: Colors.white,
        ),
        child: ListView(
            children: [
              Column(
                children: [
                  Container(
                      width: 150,
                      height: 45,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        color: Colors.blue,
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Center(child: Text('Acdemic Details', style: TextStyle(color: Colors.white ,fontSize: 15),)),
                      ),
                    ),
                ],
              ),
                Column(
                  children: [
                    SizedBox(height: 16),
              CustomTextField(
                label: 'Degree Program',
                keyboardType: TextInputType.name,
                onChanged: (value) => controller.degreeProgram.value = value,
              ),
              CustomTextField(
                label: 'Roll No',
                keyboardType: TextInputType.name,
                onChanged: (value) => controller.rollNo.value = value,
              ),
              CustomTextField(
                label: 'Section',
                keyboardType: TextInputType.name,
                onChanged: (value) => controller.section.value = value,
              ),
              CustomTextField(
                label: 'Semester',
                keyboardType: TextInputType.name,
                onChanged: (value) => controller.sememter.value = value,
              ),
               SizedBox(height: 16),

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
                  ]
                )
            ],
          ),
      ),
      );
  }
}
