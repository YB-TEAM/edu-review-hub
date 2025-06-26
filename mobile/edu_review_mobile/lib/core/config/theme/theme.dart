import 'package:edu_review_mobile/common_libs.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      scaffoldBackgroundColor: AppColors.primaryWhite,
      textTheme: AppTypography.getTextTheme(),
    );
  }
}
