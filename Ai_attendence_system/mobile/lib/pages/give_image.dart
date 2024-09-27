import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:camera/camera.dart';
import '../controlors/form_controller.dart';
import 'dart:io';

class GiveImagePage extends StatefulWidget {
  @override
  _GiveImagePageState createState() => _GiveImagePageState();
}

class _GiveImagePageState extends State<GiveImagePage> {
  final FormController controller = Get.find<FormController>();
  CameraController? _controller;
  Future<void>? _initializeControllerFuture;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    // Obtain a list of available cameras
    final cameras = await availableCameras();
    // Get the front camera
    final frontCamera = cameras.firstWhere((camera) => camera.lensDirection == CameraLensDirection.front);

    // Initialize the camera controller
    _controller = CameraController(frontCamera, ResolutionPreset.medium);
    _initializeControllerFuture = _controller!.initialize();
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  Future<void> _captureImage() async {
    try {
      await _initializeControllerFuture; // Ensure the camera is initialized

      final image = await _controller?.takePicture(); // Capture the image
      if (image != null) {
        controller.imagePath.value = image.path; // Update the image path
      }
    } catch (e) {
      print(e); // Handle errors
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(color: Colors.white),
        child: Center(
          child: ListView(
            children: [
              Column(
                children: [
                  Container(
                    width: 150,
                    height: 45,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    child: Center(
                      child: Text(
                        'Give Your Image',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
              Obx(() {
                return controller.imagePath.value.isNotEmpty
                    ? Image.file(File(controller.imagePath.value))
                    : Text('No image selected.');
              }),
              SizedBox(height: 16),
               FutureBuilder<void>(
                future: _initializeControllerFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.done) {
                    return ClipOval(
                      child: SizedBox(
                        width: 200, // Specify the diameter of the circle
                        height: 200,
                        child: CameraPreview(_controller!), // Show the camera preview
                      ),
                    );
                  } else {
                    return Center(child: CircularProgressIndicator());
                  }
                },
              ),
              ElevatedButton(
                onPressed: () async {
                  await _captureImage();
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.camera_alt), // Camera icon
                    SizedBox(width: 8),
                    Text('Capture Image'),
                  ],
                ),
              ),
              SizedBox(height: 16),
              Column(
                children: [
                  ElevatedButton(
                    style: Theme.of(context).elevatedButtonTheme.style,
                    onPressed: () {
                      if (controller.isPersonalDetailsValid() &&
                          controller.isAcademicDetailsValid()) {
                        controller.submitFormData();
                        Get.snackbar('Success', 'Registration Completed');
                        Get.toNamed('/');
                      } else {
                        Get.snackbar('Validation Error',
                            'Please fill all required fields correctly');
                      }
                    },
                    child: Text('Submit'),
                  ),
                ],
              ),
              SizedBox(height: 16),
             
            ],
          ),
        ),
      ),
    );
  }
}
