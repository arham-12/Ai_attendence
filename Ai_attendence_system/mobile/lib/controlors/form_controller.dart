import 'package:get/get.dart';

class FormController extends GetxController {
  var name = ''.obs;
  var email = ''.obs;
  var password = ''.obs;
  var confirmPassword = ''.obs;
  var degreeProgram = ''.obs;
  var rollNo = ''.obs;
  var section = ''.obs;
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
        section.value.isNotEmpty;
  }
}
