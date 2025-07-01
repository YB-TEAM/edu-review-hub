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
          right: 10,
          bottom: 12,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              shape: const CircleBorder(),
              padding: const EdgeInsets.all(4),
              backgroundColor: Colors.white,
              elevation: 2,
            ),
            onPressed: onChangeCover,
            child: const Icon(
              Icons.image,
              size: 20,
              color: AppColors.primaryBlack,
            ),
          ),
        ),
        if (child != null)
          Positioned(
            bottom: -64,
            left: 0,
            right: 0,
            child: Center(child: child!),
          ),
      ],
    );
  }
}
