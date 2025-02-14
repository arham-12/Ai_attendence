import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controlors/form_controller.dart';
import '../widgets/custom_text_field.dart';

class AcademicDetailsPage extends StatefulWidget {
  final PageController pageController;

  const AcademicDetailsPage({super.key, required this.pageController});

  @override
  _AcademicDetailsPageState createState() => _AcademicDetailsPageState();
}

class _AcademicDetailsPageState extends State<AcademicDetailsPage> {
  final FormController controller = Get.find<FormController>();
  final FocusNode _focusNode = FocusNode(); // Add a FocusNode to track focus
  bool _isFocused = false;

  // List of degree program options with icons
  final List<Map<String, dynamic>> degreePrograms = [
    {'name': 'Computer Science', 'icon': Icons.computer},
    {'name': 'Software Engineering', 'icon': Icons.code},
    {'name': 'Information Technology', 'icon': Icons.network_wifi},
    {'name': 'Data Science', 'icon': Icons.bar_chart},
    {'name': 'Business Administration', 'icon': Icons.business},
    {'name': 'Electrical Engineering', 'icon': Icons.electrical_services},
    {'name': 'Mechanical Engineering', 'icon': Icons.engineering},
  ];

  @override
  void initState() {
    super.initState();
    // Add a listener to the FocusNode to detect focus changes
    _focusNode.addListener(() {
      setState(() {
        _isFocused = _focusNode.hasFocus;
      });
    });
  }

  @override
  void dispose() {
    _focusNode.dispose(); // Dispose of the focus node when not needed
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: Container(
        height: MediaQuery.of(context).size.height,
        decoration: const BoxDecoration(
          
          color: Colors.white,
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
                    color: Colors.blue,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Center(
                      child: Text(
                        'Academic Details',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Column(
              children: [
                // SizedBox(height: 16),
              
                   Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Text(
                      //   'Select Degree Program',
                      //   style: TextStyle(
                      //       fontSize: 10, fontWeight: FontWeight.bold),
                      // ),
                      // SizedBox(height: 10),
                      SizedBox(
                        width: MediaQuery.of(context).size.width,
                        child: Obx(
                          () => DropdownButtonFormField<String>(
                            focusNode: _focusNode, // Attach FocusNode
                            value: controller.degreeProgram.value.isEmpty
                                ? null
                                : controller.degreeProgram.value,
                            hint: const Text('Select Degree Program'),
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: _isFocused
                                  ? Theme.of(context).colorScheme.secondary
                                  : Colors.grey[200], // Change fill color on focus
                              contentPadding: const EdgeInsets.symmetric(
                                  vertical: 12, horizontal: 16),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: Theme.of(context).colorScheme.secondary,
                                ),
                                // borderSide: BorderSide(
                                //     color:
                                //         _isFocused ? Colors.grey : Colors.grey,
                                //     width: 1.5),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              disabledBorder: InputBorder.none,
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide.none,
                          
                                
                                    // BorderSide(color: Theme.of(context).colorScheme.secondary, width: 2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            icon: Icon(Icons.arrow_drop_down,
                                color: Theme.of(context).colorScheme.primary),
                            iconSize: 28,
                            elevation: 16,
                            dropdownColor: Colors.white,
                            style: const TextStyle(color: Colors.black, fontSize: 16),
                            items: degreePrograms.map((program) {
                              return DropdownMenuItem<String>(
                                value: program['name'],
                                child: Row(
                                  children: [
                                    Icon(
                                      program['icon'],
                                      color: Theme.of(context).colorScheme.primary,
                                    ),
                                    const SizedBox(width: 10),
                                    Text(program['name']),
                                  ],
                                ),
                              );
                            }).toList(),
                            onChanged: (String? newValue) {
                              if (newValue != null) {
                                controller.degreeProgram.value = newValue;
                              }
                            },
                            validator: (value) =>
                                value == null ? 'Please select a program' : null,
                          ),
                        ),
                      ),
                      // SizedBox(height: 20),r
                    ],
                  ),
                const SizedBox(height: 10),
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
                  keyboardType: TextInputType.number,
                  onChanged: (value) {
                    int? semesterInput =
                        int.tryParse(value); // Try parsing the input
                    if (semesterInput != null &&
                        semesterInput >= 1 &&
                        semesterInput <= 8) {
                      controller.semester.value =
                          semesterInput; // Update only if the input is valid
                    } else {
                      Get.snackbar('Invalid Input',
                          'Please enter a value between 1 and 8.');
                    }
                  },
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  style: Theme.of(context).elevatedButtonTheme.style,
                    
                  
                  onPressed: () {
                    if (controller.isAcademicDetailsValid()) {
                      widget.pageController.nextPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeIn,
                      );
                    } else {
                      Get.snackbar('Error', 'Please fill all fields correctly.');
                    }
                  },
                  child: const Text('Next'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
