import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/svg.dart';

class CoverImagePicker extends StatelessWidget {
  final String? imageUrl;
  final bool isUploading;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;
  final double height;

  const CoverImagePicker({
    super.key,
    required this.imageUrl,
    required this.isUploading,
    required this.onTap,
    this.onDelete,
    this.height = 150,
  });

  bool get _isDefaultCoverImage => imageUrl == AppDefaultImages.defaultCover;

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
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Container(
            width: double.infinity,
            height: height,
            color: AppColors.secondaryGrey,
            child: imageUrl != null
                ? Image.network(imageUrl!, width: double.infinity, height: height, fit: BoxFit.cover)
                : const Center(
                    child: Icon(Icons.image, size: 60, color: Colors.grey),
                  ),
          ),
        ),
        Positioned(
          top: 8,
          right: 8,
          child: Row(
            children: [
              _buildCircleButton(
                assetPath: AppIcons.pencil,
                color: AppColors.primaryBlue,
                onPressed: isUploading ? null : onTap,
              ),
              if (!_isDefaultCoverImage)
                Row(
                  children: [
                    const SizedBox(width: 8),
                    _buildCircleButton(
                      assetPath: AppIcons.delete,
                      color: AppColors.primaryRed,
                      onPressed: isUploading ? null : onDelete,
                    ),
                  ],
                )
            ],
          ),
        ),
        if (isUploading)
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                color: Colors.black26,
              ),
              child: const Center(
                child: CircularProgressIndicator(
                  color: AppColors.primaryWhite,
                ),
              ),
            ),
          ),
      ],
    );
  }
}