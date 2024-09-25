import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controlors/form_controller.dart';
import '../pages/personal_details.dart';
import '../pages/academic_details.dart';
import '../pages/give_image.dart';

class MultiStepFormPage extends StatelessWidget {
  final PageController _pageController = PageController();
  final FormController controller = Get.put(FormController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(title: Text('Multi-Step Form')),
      body: Center(
        child: Container(
          padding: EdgeInsets.all(16.0),
          height: 500,
          width: 400,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8.0),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.5),
                spreadRadius: 2,
                blurRadius: 5,
                offset: Offset(0, 3),
              ),
            ] 
          ),
          child: PageView(
            controller: _pageController,
            physics: NeverScrollableScrollPhysics(), // Disable swiping
            children: [
              PersonalDetailsPage(pageController: _pageController),
              AcademicDetailsPage(pageController: _pageController),
              GiveImagePage(),
            ],
          ),
        ),
      ),
    );
  }
}
