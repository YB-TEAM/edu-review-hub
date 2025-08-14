import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/svg.dart';

class CustomImagePicker extends StatelessWidget {
  final String? imageUrl;
  final bool isUploading;
  final VoidCallback? onTap;

  const CustomImagePicker({
    super.key,
    required this.imageUrl,
    required this.isUploading,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isUploading ? null : onTap,
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: imageUrl != null
                ? Image.network(
                    imageUrl!,
                    width: double.infinity,
                    height: 200,
                    fit: BoxFit.cover,
                  )
                : Container(
                    width: double.infinity,
                    height: 200,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.image,
                        size: 60, color: Colors.grey),
                  ),
          ),
          Positioned(
            bottom: 10,
            right: 10,
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.primaryGrey,
                borderRadius: BorderRadius.circular(20),
              ),
              padding: const EdgeInsets.all(6),
              child: SvgPicture.asset("assets/icons/ic_camera.svg", height: 20, width: 20, color: AppColors.primaryWhite,)
            ),
          ),
          if (isUploading)
            Positioned.fill(
              child: Container(
                color: Colors.black26,
                child: const Center(
                  child: CircularProgressIndicator(color: Color.fromARGB(255, 69, 56, 56)),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
