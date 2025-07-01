// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter/material.dart';

class NavigationButton extends StatelessWidget {
  final IconData leadingIcon;
  final String title;
  final IconData? trailingIcon;
  final VoidCallback onTap;
  final bool isSelected;

  const NavigationButton({
    super.key,
    required this.leadingIcon,
    required this.title,
    this.trailingIcon,
    required this.onTap,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryBlack.withOpacity(0.1),
              spreadRadius: 0.5,
              blurRadius: 2, // Sử dụng ScreenUtil
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(
                  leadingIcon,
                  color: AppColors.textGrey,
                  size: 24,
                ), // Sử dụng ScreenUtil
                SizedBox(width: 12), // Sử dụng ScreenUtil
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14, // Sử dụng ScreenUtil
                    fontWeight: FontWeight.w700,
                    color: AppColors.textGrey,
                  ),
                ),
              ],
            ),
            Icon(
              trailingIcon,
              color: AppColors.textGrey,
              size: 24,
            ), // Sử dụng ScreenUtil
          ],
        ),
      ),
    );
  }
}
