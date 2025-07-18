// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter/material.dart';

class NavigationButton extends StatefulWidget {
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
  State<NavigationButton> createState() => _NavigationButtonState();
}

class _NavigationButtonState extends State<NavigationButton> {
  bool _isPressed = false;

  void _handleTapDown(TapDownDetails details) {
    setState(() {
      _isPressed = true;
    });
  }

  void _handleTapUp(TapUpDetails details) {
    setState(() {
      _isPressed = false;
    });
  }

  void _handleTapCancel() {
    setState(() {
      _isPressed = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      child: AnimatedContainer(
        duration: Duration(milliseconds: 120),
        curve: Curves.easeInOut,
        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          color: _isPressed ? Colors.grey[200] : AppColors.primaryWhite,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryBlack.withOpacity(0.1),
              spreadRadius: 0.5,
              blurRadius: 2,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(widget.leadingIcon, color: AppColors.textBlack, size: 24),
                SizedBox(width: 12),
                Text(
                  widget.title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textBlack,
                  ),
                ),
              ],
            ),
            Icon(widget.trailingIcon, color: AppColors.textBlack, size: 20),
          ],
        ),
      ),
    );
  }
}
