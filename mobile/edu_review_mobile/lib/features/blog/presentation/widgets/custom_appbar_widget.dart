import 'package:edu_review_mobile/common_libs.dart';

class CustomAppBar extends SliverPersistentHeaderDelegate {
  final double statusBarHeight;
  final double appBarHeight;
  final double searchBarHeight;

  CustomAppBar({
    required this.statusBarHeight,
    this.appBarHeight = 40,
    this.searchBarHeight = 70,
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
        // Gradient background
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [
                AppColors.primaryBlue,
                const Color(0xFF2563EB), 
                const Color(0xFF1E40AF), 
              ],
            )
          ),
        ),

        Positioned(
          top: statusBarHeight+ 8 + offsetY,
          left: 16,
          right: 16,
          child: Opacity(
            opacity: fade,
            child: Text(
              'Blog',
              style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
            ),
          ),
        ),

        // SearchBar fixed at the bottom
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            height: searchBarHeight,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              decoration: InputDecoration(
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                hintText: 'Tìm kiếm bài viết...',
                hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
                filled: true,
                fillColor: Colors.grey[200],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  @override
  bool shouldRebuild(covariant CustomAppBar oldDelegate) => true;
}
