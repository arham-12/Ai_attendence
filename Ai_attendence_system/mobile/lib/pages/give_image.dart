import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:camera/camera.dart';
import 'package:permission_handler/permission_handler.dart';
import '../controlors/form_controller.dart';
import 'dart:io';

class GiveImagePage extends StatefulWidget {
  const GiveImagePage({super.key});

  @override
  _GiveImagePageState createState() => _GiveImagePageState();
}

class _GiveImagePageState extends State<GiveImagePage> {
  final FormController controller = Get.find<FormController>();
  CameraController? _cameraController;
  Future<void>? _initializeControllerFuture;
  RxBool isCameraInitialized = false.obs;
  RxBool showCapturedImage = false.obs;

  @override
  void initState() {
    super.initState();
    _checkPermissionsAndInitializeCamera();
  }

  Future<void> _checkPermissionsAndInitializeCamera() async {
    // Request camera permission
    var status = await Permission.camera.request();
    if (status.isGranted) {
      _initializeCamera();
    } else {
      Get.snackbar('Permission Denied', 'Camera access is required to take pictures.');
    }
  }

  Future<void> _initializeCamera() async {
    try {
      final cameras = await availableCameras();
      final frontCamera = cameras.firstWhere(
          (camera) => camera.lensDirection == CameraLensDirection.front,
          orElse: () => cameras.first); // Use the first camera if front not found

      _cameraController = CameraController(frontCamera, ResolutionPreset.medium);
      _initializeControllerFuture = _cameraController!.initialize();
      await _initializeControllerFuture; // Wait for the camera to initialize
      isCameraInitialized.value = true;
      showCapturedImage.value = false;
    } catch (e) {
      Get.snackbar('Error', 'Failed to initialize camera: $e');
      print('Camera initialization error: $e');
    }
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  Future<void> _captureImage() async {
    try {
      await _initializeControllerFuture; // Ensure the camera is initialized
      final image = await _cameraController?.takePicture(); // Capture the image
      if (image != null) {
        controller.imagePath.value = image.path; // Update the image path
        _stopCamera(); // Stop the camera after capturing the image
        showCapturedImage.value = true; // Show the captured image
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to capture image: $e');
      print('Capture image error: $e');
    }
  }

  void _stopCamera() {
    _cameraController?.dispose();
    isCameraInitialized.value = false;
  }

  void _retakeImage() {
    controller.imagePath.value = ''; // Clear previous image path
    showCapturedImage.value = false; // Hide the captured image and retake button
    _initializeCamera(); // Reinitialize the camera for retaking the image
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(color: Colors.white),
        child: Center(
          child: ListView(
            padding: const EdgeInsets.all(16),
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
              const SizedBox(height: 16),
              Obx(() {
                // Proper use of Obx with observable variables
                if (showCapturedImage.value && controller.imagePath.value.isNotEmpty) {
                  return Column(
                    children: [
                      SizedBox(
                        width: 300,
                        height: 300,
                        child: Image.file(File(controller.imagePath.value)),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _retakeImage,
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.camera_alt),
                            SizedBox(width: 8),
                            Text('Retake Image'),
                          ],
                        ),
                      ),
                    ],
                  );
                } else {
                  return const Text('No image selected.');
                }
              }),
              const SizedBox(height: 16),
              Obx(() {
                // Proper use of Obx for camera preview
                if (isCameraInitialized.value && !showCapturedImage.value) {
                  return FutureBuilder<void>(
                    future: _initializeControllerFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.done) {
                        return ClipOval(
                          child: SizedBox(
                            width: 300,
                            height: 300,
                            child: CameraPreview(_cameraController!),
                          ),
                        );
                      } else {
                        return const Center(child: CircularProgressIndicator());
                      }
                    },
                  );
                } else {
                  return const SizedBox.shrink(); // Empty space when conditions are not met
                }
              }),
              const SizedBox(height: 16),
              Obx(() {
                // Proper use of Obx for Capture Image button
                if (isCameraInitialized.value && !showCapturedImage.value) {
                  return ElevatedButton(
                    onPressed: _captureImage,
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.camera_alt),
                        SizedBox(width: 8),
                        Text('Capture Image'),
                      ],
                    ),
                  );
                } else {
                  return const SizedBox.shrink();
                }
              }),
              const SizedBox(height: 16),
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
                child: const Text('Submit'),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
