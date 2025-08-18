// ignore_for_file: library_private_types_in_public_api

import 'package:edu_review_mobile/common_libs.dart';

class CustomPasswordField extends StatefulWidget {
  final String? label;
  final String? placeholder;
  final TextEditingController controller;
  final String? Function(String?)? validator;
  final Widget? prefixIcon;
  final IconData? prefixIconData;

  const CustomPasswordField({
    super.key,
    this.label,
    this.placeholder,
    required this.controller,
    this.validator,
    this.prefixIcon,
    this.prefixIconData,
  });

  @override
  _CustomPasswordFieldState createState() => _CustomPasswordFieldState();
}

class _CustomPasswordFieldState extends State<CustomPasswordField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    Widget? styledPrefixIcon;
    if (widget.prefixIcon != null) {
      if (widget.prefixIcon is Icon) {
        final icon = widget.prefixIcon as Icon;
        styledPrefixIcon = Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Icon(
            icon.icon,
            color: icon.color ?? AppColors.primaryGrey,
            size: icon.size ?? 20,
          ),
        );
      } else {
        styledPrefixIcon = widget.prefixIcon;
      }
    } else if (widget.prefixIconData != null) {
      styledPrefixIcon = Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        child: Icon(
          widget.prefixIconData,
          color: AppColors.primaryGrey,
          size: 20,
        ),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontFamily: 'Roboto-Bold',
              color: AppColors.textBlack,
            ),
          ),
          const SizedBox(height: 6),
        ],
        TextFormField(
          controller: widget.controller,
          obscureText: _obscureText,
          validator: widget.validator,
          style: Theme.of(context).textTheme.bodyMedium,
          decoration: InputDecoration(
            errorMaxLines: 2,
            hintText: widget.placeholder,
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
                color: AppColors.primaryBlue,
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
            prefixIcon: styledPrefixIcon,
          ),
          autovalidateMode: AutovalidateMode.onUserInteraction,
        ),
      ],
    );
  }
}
