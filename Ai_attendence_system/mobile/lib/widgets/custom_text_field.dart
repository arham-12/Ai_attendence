import 'package:flutter/material.dart';

class CustomTextField extends StatefulWidget {
  final String label;
  final bool obscureText;
  final Function(String) onChanged;
  final TextInputType keyboardType;

  CustomTextField({
    required this.label,
    this.obscureText = false,
    required this.onChanged,
    required this.keyboardType,
  });

  @override
  _CustomTextFieldState createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  final FocusNode _focusNode = FocusNode();
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    // Listen for focus changes
    _focusNode.addListener(() {
      setState(() {
        _isFocused = _focusNode.hasFocus;
      });
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextField(
        focusNode: _focusNode,
        obscureText: widget.obscureText,
        keyboardType: widget.keyboardType,
        style: TextStyle(color: _isFocused ? Theme.of(context).colorScheme.onSecondary : Theme.of(context).colorScheme.secondaryFixedDim),
        decoration: InputDecoration(
          labelText: widget.label,
          filled: true,
          labelStyle: TextStyle(color: _isFocused ? Colors.blue : Colors.grey[500]),
          fillColor: _isFocused ? Colors.blue[50] : Colors.grey[150], // Change fill color on focus
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
        ),
        onChanged: widget.onChanged,
      ),
    );
  }
}
