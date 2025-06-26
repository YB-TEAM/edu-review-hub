

import 'package:edu_review_mobile/common_libs.dart';

class PrimaryButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String title;
  const PrimaryButton({super.key, required this.onPressed, required this.title});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primaryBlue,
        minimumSize: Size(double.infinity, 50),
        padding: EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: Text(
        title,
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
          color: AppColors.textWhite,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}