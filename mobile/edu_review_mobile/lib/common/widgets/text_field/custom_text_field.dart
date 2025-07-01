import 'package:edu_review_mobile/common_libs.dart';

class CustomTextField extends StatelessWidget {
  final String? label;
  final String placeholder;
  final bool obscureText;
  final TextEditingController controller;
  final Widget? suffixIcon;
  final Widget? prefixIcon;
  final IconData? prefixIconData;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;

  const CustomTextField({
    super.key,
    this.label,
    required this.placeholder,
    required this.controller,
    this.validator,
    this.obscureText = false,
    this.suffixIcon,
    this.prefixIcon,
    this.prefixIconData,
    this.keyboardType,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    Widget? styledPrefixIcon;
    if (prefixIcon != null) {
      if (prefixIcon is Icon) {
        final icon = prefixIcon as Icon;
        styledPrefixIcon = Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Icon(
            icon.icon,
            color: icon.color ?? AppColors.primaryGrey,
            size: icon.size ?? 20,
          ),
        );
      } else {
        styledPrefixIcon = prefixIcon;
      }
    } else if (prefixIconData != null) {
      styledPrefixIcon = Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        child: Icon(prefixIconData, color: AppColors.primaryGrey, size: 20),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontFamily: 'Roboto-Bold',
              color: AppColors.textBlack,
            ),
          ),
          const SizedBox(height: 6),
        ],
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          onChanged: onChanged,
          validator: validator,
          style: Theme.of(context).textTheme.bodyMedium,
          decoration: InputDecoration(
            hintText: placeholder,
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
              borderSide: BorderSide(
                color: AppColors.secondaryGrey,
                width: 1.0,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: const BorderSide(
                color: AppColors.primaryBlack,
                width: 2.0,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            errorBorder: OutlineInputBorder(
              borderSide: const BorderSide(
                color: AppColors.primaryRed,
                width: 2.0,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderSide: const BorderSide(
                color: AppColors.primaryRed,
                width: 2.0,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            suffixIcon: suffixIcon,
            prefixIcon: styledPrefixIcon,
          ),
          autovalidateMode: AutovalidateMode.onUserInteraction,
        ),
      ],
    );
  }
}
