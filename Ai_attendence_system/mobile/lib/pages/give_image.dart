import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import '../controlors/form_controller.dart';
import 'dart:io';
class GiveImagePage extends StatelessWidget {
  final FormController controller = Get.find<FormController>();

  Future<void> _pickImage() async {
    final ImagePicker _picker = ImagePicker();
    final XFile? image = await _picker.pickImage(source: ImageSource.camera);
    if (image != null) {
      controller.imagePath.value = image.path;
      // You can also handle the image upload to the backend here
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(title: Text('Give Image')),
      body: Container(
        decoration: BoxDecoration(
         color:  Colors.white,
        ),
        
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                          width: 150,
                          height: 45,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            color: Colors.blue,
                          ),
                                        
                            // padding: const EdgeInsets.all(8.0),
                            child: Center(child: Text('Give Your Image', style: TextStyle(color: Colors.white ,fontSize: 15),)),
                        
                        ),
              Obx(() {
                return controller.imagePath.value.isNotEmpty
                    ? Image.file(File(controller.imagePath.value))
                    : Text('No image selected.');
              }),
              SizedBox(height: 16),
             ElevatedButton(
  onPressed: _pickImage,
  child: Row(
    mainAxisSize: MainAxisSize.min, // Adjust the size of the button to fit the content
    children: [
      Icon(Icons.camera_alt), // Camera icon
      SizedBox(width: 8), // Add some space between the icon and text
      Text('Capture Image'),
    ],
  ),
),

              
              SizedBox(height: 16),

              ElevatedButton(
                onPressed: () {
                 // Validate personal and academic details before submission
                  if (controller.isPersonalDetailsValid() &&
                      controller.isAcademicDetailsValid()) {
                    // Call the form submission method
                    controller.submitFormData();
                    Get.snackbar('Success', 'Registeration Completed');
                    Get.toNamed('/');
                  } else {
                    Get.snackbar('Validation Error', 'Please fill all required fields correctly');
                  }
                },
                child: Text('Submit'),
              ),
            ],
          ),
        ),
      ),
    
    );
  }
}
