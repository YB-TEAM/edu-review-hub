// ignore_for_file: library_private_types_in_public_api

import 'package:edu_review_mobile/common_libs.dart';

class CustomPasswordField extends StatefulWidget {
  final String? placeholder;
  final TextEditingController controller;
  final String? Function(String?)? validator;

  const CustomPasswordField({
    super.key, 
    this.placeholder,
    required this.controller,
    this.validator,
  });

  @override
  _CustomPasswordFieldState createState() => _CustomPasswordFieldState();
}

class _CustomPasswordFieldState extends State<CustomPasswordField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      obscureText: _obscureText,
      decoration: InputDecoration(
        hintText: widget.placeholder ?? 'Password',
        filled: true,
        fillColor: const Color(0xFFF7F7F9),
        border: OutlineInputBorder(
          borderSide: BorderSide.none,
          borderRadius: BorderRadius.circular(8.0),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: AppColors.primaryBlack, width: 2.0),
          borderRadius: BorderRadius.circular(8.0),
        ),
        errorBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: AppColors.primaryRed, width: 2.0),
          borderRadius: BorderRadius.circular(8.0),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: AppColors.primaryBlack, width: 2.0),
          borderRadius: BorderRadius.circular(8.0),
        ),
        suffixIcon: IconButton(
          icon: Icon(_obscureText ? Icons.visibility_off : Icons.visibility),
          style: ButtonStyle(
            splashFactory: NoSplash.splashFactory, 
          ),
          onPressed: () {
            setState(() {
              _obscureText = !_obscureText;
            });
          },
        ),
      ),
    );
  }
}