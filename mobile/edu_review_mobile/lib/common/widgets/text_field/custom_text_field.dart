import 'package:edu_review_mobile/common_libs.dart';

class CustomTextField extends StatelessWidget {
  final String placeholder;
  final bool obscureText;
  final TextEditingController controller;
  final Widget? suffixIcon;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;

  const CustomTextField({
    super.key,
    required this.placeholder,
    required this.controller,
    this.validator,
    this.obscureText = false,
    this.suffixIcon,
    this.keyboardType,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      onChanged: onChanged,
      decoration: InputDecoration(
        hintText: placeholder,
        labelStyle: TextStyle(),
        filled: true,
        fillColor: AppColors.secondaryGrey,
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
        suffixIcon: suffixIcon,
      ),
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }
}