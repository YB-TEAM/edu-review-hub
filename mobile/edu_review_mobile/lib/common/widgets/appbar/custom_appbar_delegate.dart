import 'package:edu_review_mobile/common/widgets/search_bar/custom_search_bar.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/utils/typewritter_text.dart';

class CustomAppBar extends SliverPersistentHeaderDelegate {
  final double statusBarHeight;
  final double appBarHeight;
  final double searchBarHeight;
  final String title;
  final String hintText;

  CustomAppBar({
    required this.statusBarHeight,
    required this.title,
    required this.hintText,
    this.appBarHeight = 40,
    this.searchBarHeight = 56, 
  });

  @override
  double get minExtent => statusBarHeight + searchBarHeight;

  @override
  double get maxExtent => statusBarHeight + appBarHeight + searchBarHeight;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    final double fadeDistance = maxExtent - minExtent;
    final double effectiveShrinkOffset = shrinkOffset.clamp(0.0, fadeDistance);
    final double fade = (1 - effectiveShrinkOffset / fadeDistance).clamp(0.0, 1.0);
    final double offsetY = -effectiveShrinkOffset * 0.6;

    return Stack(
      fit: StackFit.expand,
      children: [
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [
                AppColors.primaryBlue,
                Color(0xFF2563EB),
                Color(0xFF1E40AF),
              ],
            ),
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(16),
              bottomRight: Radius.circular(16),
            ),
          ),
        ),
        Positioned(
          top: statusBarHeight + 8 + offsetY,
          left: 16,
          right: 16,
          child: Opacity(
            opacity: fade,
            child: TypewriterText(
              text: title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
            ),
          ),
        ),
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: CustomSearchBar(height: searchBarHeight, hintText: hintText,),
        ),
      ],
    );
  }

  @override
  bool shouldRebuild(covariant CustomAppBar oldDelegate) => true;
}
