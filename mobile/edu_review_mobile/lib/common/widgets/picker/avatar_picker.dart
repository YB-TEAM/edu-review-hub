import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/svg.dart';

class AvatarImagePicker extends StatelessWidget {
  final String? imageUrl;
  final bool isUploading;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;
  final double size;

  const AvatarImagePicker({
    super.key,
    required this.imageUrl,
    required this.isUploading,
    required this.onTap,
    this.onDelete,
    this.size = 150,
  });

  bool get _isDefaultAvatarImage => imageUrl == AppDefaultImages.defaultAvatar;

  Widget _buildCircleButton({required String assetPath, required VoidCallback? onPressed, required Color color}) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          
        ),
        padding: const EdgeInsets.all(8),
        child: SvgPicture.asset(
          assetPath,
          color: AppColors.primaryWhite,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: AppColors.secondaryGrey,
              width: 2,
            ),
          ),
          child: ClipOval(
            child: imageUrl != null
                ? Image.network(imageUrl!, width: size, height: size, fit: BoxFit.cover)
                : const Icon(Icons.person, size: 60, color: Colors.grey),
          ),
        ),
        if (!_isDefaultAvatarImage)
          Positioned(
            top: 0,
            right: 0,
            child: _buildCircleButton(
              assetPath: AppIcons.delete,
              color: AppColors.primaryRed,
              onPressed: isUploading ? null : onDelete,
            ),
          ),
        Positioned(
          bottom: 0,
          right: 0,
          child: _buildCircleButton(
            assetPath: AppIcons.pencil,
            color: AppColors.primaryBlue,
            onPressed: isUploading ? null : onTap,
          ),
        ),
        if (isUploading)
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.black26,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: SizedBox(
                  width: size / 3,
                  height: size / 3,
                  child: const CircularProgressIndicator(
                    color: AppColors.primaryWhite,
                    strokeWidth: 3,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
