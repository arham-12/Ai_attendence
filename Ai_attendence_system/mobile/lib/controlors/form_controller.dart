import 'package:get/get.dart';
// import 'package:dio/dio.dart';
import 'package:dio/dio.dart' as dio;
class FormController extends GetxController {
  var name = ''.obs;
  var email = ''.obs;
  var password = ''.obs;
  var confirmPassword = ''.obs;
  var degreeProgram = ''.obs;
  var rollNo = ''.obs;
  var section = ''.obs;
  var semester = 0.obs;
  var imagePath = ''.obs;

  bool isPersonalDetailsValid() {
    return name.value.isNotEmpty &&
        email.value.isNotEmpty &&
        password.value.isNotEmpty &&
        confirmPassword.value.isNotEmpty &&
        password.value == confirmPassword.value;
  }

  bool isAcademicDetailsValid() {
    return degreeProgram.value.isNotEmpty &&
        rollNo.value.isNotEmpty &&
        section.value.isNotEmpty&&
        semester.value >= 1 && semester.value <= 8;
  }

  // Function to submit form data to the backend server
 // Function to submit form data to the backend server
  Future<void> submitFormData() async {
    try {
      // Replace with your backend server URL
      const String url = 'https://your-backend-server.com/submit';

      // Create a Dio instance
      dio.Dio dioClient = dio.Dio();

      // Prepare the form data using the dio prefix
      dio.FormData formData = dio.FormData.fromMap({
        'name': name.value,
        'email': email.value,
        'password': password.value,
        'degreeProgram': degreeProgram.value,
        'rollNo': rollNo.value,
        'section': section.value,
        'sememter': semester.value,
        // If imagePath is not empty, add the file to the form data
        if (imagePath.value.isNotEmpty)
          'image': await dio.MultipartFile.fromFile(imagePath.value, filename: 'image.jpg'),
      });

      // Send POST request
      dio.Response response = await dioClient.post(url, data: formData);

      // Handle the response
      if (response.statusCode == 200) {
        Get.snackbar('Success', 'Form data submitted successfully');
      } else {
        Get.snackbar('Error', 'Failed to submit form data');
      }
    } catch (e) {
      // Handle errors
      Get.snackbar('Error', 'An error occurred: $e');
    }
  }
}

