import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/svg.dart';

class EditAvatarButton extends StatefulWidget {
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
  State<EditAvatarButton> createState() => _EditAvatarButtonState();
}

class _EditAvatarButtonState extends State<EditAvatarButton> {
  bool isPressed = false;

  void _showFullImage() {
    showDialog(
      context: context,
      builder:
          (_) => Dialog(
            backgroundColor: Colors.transparent,
            child: GestureDetector(
              onTap: () => Navigator.of(context).pop(),
              child: InteractiveViewer(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(widget.imageUrl),
                ),
              ),
            ),
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: Stack(
        alignment: Alignment.bottomRight,
        children: [
          GestureDetector(
            onTapDown: (_) {
              setState(() => isPressed = true);
            },
            onTapUp: (_) {
              setState(() => isPressed = false);
              _showFullImage();
            },
            onTapCancel: () {
              setState(() => isPressed = false);
            },
            child: Stack(
              children: [
                CircleAvatar(
                  radius: widget.size / 2,
                  backgroundColor: Colors.white,
                  child: CircleAvatar(
                    radius: widget.size / 2 - 4,
                    backgroundImage: NetworkImage(widget.imageUrl),
                  ),
                ),
                if (isPressed)
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.3),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
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
              onPressed: widget.onPressed,
              child: SvgPicture.asset(
                AppIcons.camera,
                width: 20,
                height: 20,
                // ignore: deprecated_member_use
                color: AppColors.primaryBlack,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
