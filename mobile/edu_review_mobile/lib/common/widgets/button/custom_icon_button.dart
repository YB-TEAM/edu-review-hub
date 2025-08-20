import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CustomIconButton extends StatelessWidget {
  final bool isCollapsed;
  final VoidCallback? onTap;
  final String iconAssetPath;
  final int badgeCount;
  final double iconSize;
  final Color? iconColor;
  final Color? backgroundColor;

  const CustomIconButton({
    Key? key,
    required this.isCollapsed,
    this.onTap,
    required this.iconAssetPath,
    this.badgeCount = 0,
    this.iconSize = 24,
    this.iconColor = Colors.white,
    this.backgroundColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
         boxShadow: isCollapsed
          ? []
          : [
          BoxShadow(
            color: AppColors.primaryBlack.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
        color: isCollapsed
            ? Colors.transparent
            : (backgroundColor ?? AppColors.primaryWhite.withOpacity(0.2)),
        shape: BoxShape.circle,
      ),
      child: IconButton(
        onPressed: onTap ??
            () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Tính năng này sẽ được cập nhật sau!'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
        icon: Stack(
          children: [
            SvgPicture.asset(
              iconAssetPath,
              width: iconSize,
              height: iconSize,
              color: iconColor,
            ),
            if (badgeCount > 0)
              Positioned(
                right: 0,
                top: 0,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  constraints: const BoxConstraints(minWidth: 12, minHeight: 12),
                  child: Text(
                    '$badgeCount',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 8,
                      fontWeight: FontWeight.w900,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
          ],
        ),
        tooltip: 'Action',
      ),
    );
  }
}
