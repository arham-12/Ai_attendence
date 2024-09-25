import 'package:flutter/material.dart';

class TestStepper extends StatefulWidget {
  const TestStepper({super.key});

  @override
  State<TestStepper> createState() => _TestStepperState();
}

class _TestStepperState extends State<TestStepper> {
  int _currentStep = 0; // Track the current step

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Horizontal Stepper')),
        body: Center(
          child: Container(
            padding: const EdgeInsets.all(16.0),
            color: Colors.green,
            width: double.infinity, // Make it responsive
            child: SingleChildScrollView( // Allow horizontal scrolling if needed
              child: Stepper(
                currentStep: _currentStep,
                onStepTapped: (step) => setState(() => _currentStep = step),
                onStepContinue: () {
                  if (_currentStep < 4) {
                    setState(() => _currentStep++);
                  }
                },
                onStepCancel: () {
                  if (_currentStep > 0) {
                    setState(() => _currentStep--);
                  }
                },
                steps: const [
                  Step(title: Text('Step 1'), content: Text('Content 1')),
                  Step(title: Text('Step 2'), content: Text('Content 2')),
                  Step(title: Text('Step 3'), content: Text('Content 3')),
                  Step(title: Text('Step 4'), content: Text('Content 4')),
                  Step(title: Text('Step 5'), content: Text('Content 5')),
                ],
                type: StepperType.horizontal, // Set Stepper to horizontal
              ),
            ),
          ),
        ),
      ),
    );
  }
}

void main() {
  runApp(const TestStepper());
}