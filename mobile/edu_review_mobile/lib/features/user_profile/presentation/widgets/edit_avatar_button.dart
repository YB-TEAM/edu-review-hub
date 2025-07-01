import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter/material.dart';

class EditAvatarButton extends StatelessWidget {
  final String imageUrl;
  final VoidCallback onPressed;
  final double size;

  const EditAvatarButton({
    super.key,
    required this.imageUrl,
    required this.onPressed,
    this.size = 128,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.bottomRight,
        children: [
          CircleAvatar(
            radius: size / 2,
            backgroundColor: Colors.white,
            child: CircleAvatar(
              radius: size / 2 - 4,
              backgroundImage: NetworkImage(imageUrl),
            ),
          ),
          Positioned(
            right: -8,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                shape: const CircleBorder(),
                padding: const EdgeInsets.all(4),
                backgroundColor: Colors.white,
                elevation: 2,
              ),
              onPressed: onPressed,
              child: const Icon(
                Icons.camera_alt,
                size: 20,
                color: AppColors.primaryBlack,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
