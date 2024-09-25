import 'package:flutter/material.dart';


class StepperComponent extends StatelessWidget {
  final int index; // Position of the bubble
  final dynamic currentIndex; // Index that will change on Tap
  final VoidCallback onTap; // Callback for tap action
  final bool isLast; // Indicates if it's the last step

  const StepperComponent({
    super.key,
    required this.currentIndex,
    required this.index,
    required this.onTap,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            // This is the bubble
            GestureDetector(
              onTap: onTap,
              child: Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(100),
                  color: index == currentIndex ? Colors.blue : Colors.transparent,
                  border: Border.all(color: currentIndex == index ? Colors.blue : Colors.black12),
                ),
              ),
            ),
            // This is the line
            if (!isLast) ...[
              Expanded(
                child: Container(
                  height: 2,
                  color: currentIndex == index + 1 ? Colors.blue : Colors.black12,
                ),
              ),
            ] else ...[
              Container(
                height: 2,
                color: currentIndex == index + 1 ? Colors.blue : Colors.black12,
              ),
            ],
          ],
        ),
        // Page text (index + 1 to avoid showing 0)
        Text('Page ${index + 1}'),
      ],
    );
  }
}

// A widget function to build the stepper controls
Widget buildStepperControls({
  required int totalSteps,
  required ValueNotifier<int> currentStep,
  required PageController pageController,
  required Function registerStudent,
  required Function isStepValid,
}) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      if (currentStep.value > 0)
        ElevatedButton(
          onPressed: () {
            if (currentStep.value > 0) {
              currentStep.value--;
              pageController.previousPage(
                  duration: const Duration(milliseconds: 300), curve: Curves.ease);
            }
          },
          child: const Text('Back'),
        ),
      const SizedBox(width: 8),
      ElevatedButton(
        onPressed: () {
          if (isStepValid(currentStep.value)) {
            if (currentStep.value < totalSteps - 1) {
              currentStep.value++;
              pageController.nextPage(
                  duration: const Duration(milliseconds: 300), curve: Curves.ease);
            } else {
              registerStudent();
            }
          }
        },
        child: Text(currentStep.value == totalSteps - 1 ? 'Submit' : 'Next'),
      ),
    ],
  );
}
