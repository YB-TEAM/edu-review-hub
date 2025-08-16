import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/svg.dart';

class CustomImagePicker extends StatelessWidget {
  final String? imageUrl;
  final bool isUploading;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;

  const CustomImagePicker({
    super.key,
    required this.imageUrl,
    required this.isUploading,
    required this.onTap,
    this.onDelete,
  });

  Widget _buildCircleButton({required String assetPath, required VoidCallback? onPressed}) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: AppColors.primaryGrey,
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
            height: 200,
            color: AppColors.secondaryGrey, 
            child: imageUrl != null
                ? FittedBox(
                    fit: BoxFit.contain, 
                    child: Image.network(imageUrl!),
                  )
                : Center(
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.image,
                        size: 40,
                        color: Colors.grey,
                      ),
                    ),
                  ),
          ),
        ),
        if (imageUrl != null)
          Positioned(
            top: 8,
            right: 16,
            child: Row(
              children: [
                _buildCircleButton(
                  assetPath: AppIcons.pencil,
                  onPressed: isUploading ? null : onTap,
                ),
                const SizedBox(width: 8),
                _buildCircleButton(
                  assetPath: AppIcons.delete,
                  onPressed: isUploading ? null : onDelete,
                ),
              ],
            ),
          )
        else
          Positioned(
            bottom: 10,
            right: 10,
            child: _buildCircleButton(
              assetPath: AppIcons.camera,
              onPressed: isUploading ? null : onTap,
            ),
          ),
        if (isUploading)
          Positioned.fill(
            child: Container(
              color: Colors.black26,
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
