import 'package:edu_review_mobile/common_libs.dart';

class CustomTextButton extends StatelessWidget {
  final String title;
  final VoidCallback? onPressed;
  final Color? color;
  final FontWeight? fontWeight;
  final TextStyle? style;

  const CustomTextButton({
    super.key,
    required this.title,
    this.onPressed,
    this.color,
    this.fontWeight,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: ButtonStyle(
        splashFactory: NoSplash.splashFactory, 
      ),
      child: Text(
        title,
        style: style ?? Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: color ?? AppColors.primaryOrange,
          fontWeight: fontWeight ?? FontWeight.w900,
        ),
      ),
    );
  }
} 