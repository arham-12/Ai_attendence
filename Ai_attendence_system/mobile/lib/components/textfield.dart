import 'package:flutter/material.dart';
// import 'package:fluttertoast/fluttertoast.dart';



  Widget buildTextField({
    required TextEditingController controller,
    required String label,
    bool obscureText = false,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        controller: controller,
        obscureText: obscureText,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          hintText: label,
          filled: true,
          fillColor: Colors.grey[100],
          hoverColor: Colors.blue[50],
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
        ),
        validator: validator,
      ),
    );
  }
