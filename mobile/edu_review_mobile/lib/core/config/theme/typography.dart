import 'package:edu_review_mobile/common_libs.dart';

class AppTypography {
  // Font constants - sử dụng đúng family Roboto đã khai báo
  static const String fontThin = 'Roboto-Thin';
  static const String fontExtraLight = 'Roboto-ExtraLight';
  static const String fontLight = 'Roboto-Light';
  static const String fontRegular = 'Roboto-Regular';
  static const String fontMedium = 'Roboto-Medium';
  static const String fontSemiBold = 'Roboto-SemiBold';
  static const String fontBold = 'Roboto-Bold';
  static const String fontExtraBold = 'Roboto-ExtraBold';
  static const String fontBlack = 'Roboto-Black';
  static const String fontItalic = 'Roboto-Italic';

  static TextTheme getTextTheme() {
    return TextTheme(
      headlineLarge: TextStyle(
          fontFamily: fontExtraBold, fontSize: 26, color: AppColors.textBlack),
      headlineMedium: TextStyle(
          fontFamily: fontExtraBold, fontSize: 24, color: AppColors.textBlack),
      headlineSmall: TextStyle(
          fontFamily: fontExtraBold, fontSize: 22, color: AppColors.textBlack),
      bodyLarge: TextStyle(
          fontFamily: fontRegular, fontSize: 16, color: AppColors.textBlack),
      bodyMedium: TextStyle(
          fontFamily: fontRegular, fontSize: 14, color: AppColors.textBlack),
      bodySmall: TextStyle(
          fontFamily: fontRegular, fontSize: 12, color: AppColors.textBlack),
      labelLarge: TextStyle(
          fontFamily: fontMedium, fontSize: 18, color: AppColors.textBlack),
      labelMedium: TextStyle(
          fontFamily: fontMedium, fontSize: 16, color: AppColors.textBlack),
      labelSmall: TextStyle(
          fontFamily: fontMedium, fontSize: 14, color: AppColors.textBlack),
      titleLarge: TextStyle(
          fontFamily: fontSemiBold, fontSize: 20, color: AppColors.textBlack),
      titleMedium: TextStyle(
          fontFamily: fontSemiBold, fontSize: 18, color: AppColors.textBlack),
      titleSmall: TextStyle(
          fontFamily: fontSemiBold, fontSize: 16, color: AppColors.textBlack),
      displayLarge: TextStyle(
          fontFamily: fontSemiBold, fontSize: 14, color: AppColors.textBlack),
      displayMedium: TextStyle(
          fontFamily: fontSemiBold, fontSize: 12, color: AppColors.textBlack),
      displaySmall: TextStyle(
          fontFamily: fontSemiBold, fontSize: 10, color: AppColors.textBlack),
    );
  }

  static TextTheme get textTheme => getTextTheme();
}
