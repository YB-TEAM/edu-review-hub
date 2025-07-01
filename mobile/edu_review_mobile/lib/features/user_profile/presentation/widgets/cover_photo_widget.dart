import 'package:edu_review_mobile/core/config/theme/color.dart';
import 'package:flutter/material.dart';

class CoverPhotoWidget extends StatelessWidget {
  final String imageUrl;
  final VoidCallback onChangeCover;
  final double height;
  final Widget? child;

  const CoverPhotoWidget({
    super.key,
    required this.imageUrl,
    required this.onChangeCover,
    this.height = 200,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          width: double.infinity,
          height: height,
          decoration: BoxDecoration(
            image: DecorationImage(
              image: NetworkImage(imageUrl),
              fit: BoxFit.cover,
            ),
          ),
        ),
        Positioned(
          right: 16,
          bottom: 12,
          child: ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(6),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 8),
            ),
            onPressed: onChangeCover,
            icon: const Icon(
              Icons.camera_alt,
              color: AppColors.primaryBlack,
              size: 20,
            ),
            label: Text(
              'Change cover photo',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.primaryBlack,
                fontFamily: "Roboto-Medium",
              ),
            ),
          ),
        ),
        if (child != null) Positioned(bottom: -64, left: 24, child: child!),
      ],
    );
  }
}
