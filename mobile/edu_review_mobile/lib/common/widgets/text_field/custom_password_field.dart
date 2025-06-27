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
      validator: widget.validator,
      style: Theme.of(context).textTheme.bodyMedium,
      decoration: InputDecoration(
        hintText: widget.placeholder ?? 'Password',
        hintStyle: Theme.of(
          context,
        ).textTheme.bodyMedium?.copyWith(color: AppColors.textGrey),
        filled: true,
        fillColor: AppColors.primaryWhite,
        contentPadding: const EdgeInsets.symmetric(
          vertical: 10,
          horizontal: 12,
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: AppColors.secondaryGrey, width: 1.0),
          borderRadius: BorderRadius.circular(8.0),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: const BorderSide(
            color: AppColors.primaryBlue,
            width: 2.0,
          ),
          borderRadius: BorderRadius.circular(8.0),
        ),
        errorBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: AppColors.primaryRed, width: 2.0),
          borderRadius: BorderRadius.circular(8.0),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: AppColors.primaryRed, width: 2.0),
          borderRadius: BorderRadius.circular(8.0),
        ),
        suffixIcon: IconButton(
          icon: Icon(
            _obscureText ? Icons.visibility_off : Icons.visibility,
            color: AppColors.primaryGrey,
            size: 20,
          ),
          style: ButtonStyle(splashFactory: NoSplash.splashFactory),
          onPressed: () {
            setState(() {
              _obscureText = !_obscureText;
            });
          },
        ),
      ),
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }
}
