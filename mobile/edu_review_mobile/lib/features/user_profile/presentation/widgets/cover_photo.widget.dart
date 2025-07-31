import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/svg.dart';

class CoverPhotoWidget extends StatefulWidget {
  final String imageUrl;
  final VoidCallback onChangeCover;
  final double height;
  final Widget? child;

  const CoverPhotoWidget({
    super.key,
    required this.imageUrl,
    required this.onChangeCover,
    this.height = 180,
    this.child,
  });

  @override
  State<CoverPhotoWidget> createState() => _CoverPhotoWidgetState();
}

class _CoverPhotoWidgetState extends State<CoverPhotoWidget> {
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
    return Stack(
      clipBehavior: Clip.none,
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
              Container(
                width: double.infinity,
                height: widget.height,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(widget.imageUrl),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              if (isPressed)
                Positioned.fill(
                  child: Container(
                    width: double.infinity,
                    height: widget.height,
                    color: Colors.black.withOpacity(0.3),
                  ),
                ),
            ],
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
            onPressed: widget.onChangeCover,
            child: SvgPicture.asset(
              AppIcons.camera,
              width: 20,
              height: 20,
              // ignore: deprecated_member_use
              color: AppColors.primaryBlack,
            ),
          ),
        ),
        if (widget.child != null)
          Positioned(
            bottom: -56,
            left: 0,
            right: 0,
            child: Center(child: widget.child!),
          ),
      ],
    );
  }
}
