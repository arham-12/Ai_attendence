import 'package:flutter/material.dart';
import 'package:get/get.dart'; // For state management

class MultiStepFormController extends GetxController {
  var currentStep = 0.obs;

  void nextStep() {
    if (currentStep.value < 2) {
      currentStep.value++;
    }
  }

  void previousStep() {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  }

  bool isLastStep() => currentStep.value == 2;

  bool isFirstStep() => currentStep.value == 0;
}

class MultiStepForm extends StatelessWidget {
  final MultiStepFormController controller = Get.put(MultiStepFormController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Multi-Step Form")),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              SizedBox(
                width: double.infinity,
                child: Stepper(
                  type: StepperType.horizontal,
                  currentStep: controller.currentStep.value,
                  onStepTapped: (step) {
                    controller.currentStep.value = step;
                  },
                  onStepContinue: () {
                    controller.nextStep();
                  },
                  onStepCancel: () {
                    controller.previousStep();
                  },
                  steps: [
                    Step(
                      title: Text("Step 1"),
                      content: buildPersonalDetailsStep(),
                      isActive: controller.currentStep.value == 0,
                      state: controller.currentStep.value >= 0
                          ? StepState.complete
                          : StepState.disabled,
                    ),
                    Step(
                      title: Text("Step 2"),
                      content: buildAcademicDetailsStep(),
                      isActive: controller.currentStep.value == 1,
                      state: controller.currentStep.value >= 1
                          ? StepState.complete
                          : StepState.disabled,
                    ),
                    Step(
                      title: Text("Step 3"),
                      content: buildImageUploadStep(),
                      isActive: controller.currentStep.value == 2,
                      state: controller.currentStep.value >= 2
                          ? StepState.complete
                          : StepState.disabled,
                    ),
                  ],
                ),
              ),
              SizedBox(height: 20),
              if (controller.isLastStep())
                ElevatedButton(
                  onPressed: () {
                    // Submit your form data
                    print("Form Submitted!");
                  },
                  child: Text("Submit"),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildPersonalDetailsStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          decoration: InputDecoration(labelText: 'Name'),
        ),
        TextField(
          decoration: InputDecoration(labelText: 'Email'),
        ),
      ],
    );
  }

  Widget buildAcademicDetailsStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          decoration: InputDecoration(labelText: 'Roll Number'),
        ),
        TextField(
          decoration: InputDecoration(labelText: 'Degree Program'),
        ),
      ],
    );
  }

  Widget buildImageUploadStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Upload an image"),
        ElevatedButton(
          onPressed: () {
            // Implement image upload logic
          },
          child: Text("Pick Image"),
        ),
      ],
    );
  }
}

