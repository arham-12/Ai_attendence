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
      appBar: AppBar(title: Text('Give Image')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Obx(() {
              return controller.imagePath.value.isNotEmpty
                  ? Image.file(File(controller.imagePath.value))
                  : Text('No image selected.');
            }),
            ElevatedButton(
              onPressed: _pickImage,
              child: Text('Capture Image'),
            ),
            ElevatedButton(
              onPressed: () {
                // Handle the submission here
                // Send all data to the backend using Dio
              },
              child: Text('Submit'),
            ),
          ],
        ),
      ),
    );
  }
}
