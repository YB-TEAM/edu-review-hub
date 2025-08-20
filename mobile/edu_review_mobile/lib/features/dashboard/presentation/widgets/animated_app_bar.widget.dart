import 'package:edu_review_mobile/common/widgets/search_bar/custom_search_bar.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/utils/typewritter_text.dart';

class AnimatedSliverAppBar extends SliverPersistentHeaderDelegate {
  final double statusBarHeight;
  final double expandedHeight;
  final String title;
  final String subtitle;
  final String hintText;

  AnimatedSliverAppBar({
    required this.statusBarHeight,
    this.expandedHeight = 80, 
    required this.title,
    required this.subtitle,
    required this.hintText,
  });

  @override
  double get minExtent => statusBarHeight + 56;
  @override
  double get maxExtent => statusBarHeight + expandedHeight + 40;

@override
Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
  final double fadeDistance = maxExtent - minExtent;
  final double fade = (1 - (shrinkOffset / fadeDistance)).clamp(0.0, 1.0);
  final double offsetY = -shrinkOffset * 0.5;

  final double searchBarHeight = 56;

  return Stack(
    fit: StackFit.expand,
    children: [
      // Background gradient
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
      // Title + subtitle, fade theo scroll
      Positioned(
        top: statusBarHeight + 12 + offsetY,
        left: 12,
        right: 12,
        child: Opacity(
          opacity: fade,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              GestureDetector(onTap: () {}, child: buildEButton()),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context)
                          .textTheme
                          .titleLarge
                          ?.copyWith(color: AppColors.textWhite, fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 4),
                    TypewriterText(
                      text: subtitle,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textWhite,
                            fontWeight: FontWeight.w700,
                          ),
                      typingDuration: const Duration(milliseconds: 70),
                      holdDuration: const Duration(seconds: 2),
                      fadeDuration: const Duration(milliseconds: 800),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      Positioned(
        bottom: 0,
        left: 2,
        right: 2,
        child: CustomSearchBar(
          height: searchBarHeight,
          hintText: hintText,
        ),
      ),
    ],
  );
}



  @override
  bool shouldRebuild(covariant AnimatedSliverAppBar oldDelegate) => true;
}

Widget buildEButton() {
  return Container(
    width: 48,
    height: 48,
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(12),
      shape: BoxShape.rectangle,
      gradient: LinearGradient(
        colors: [
          Color(0xFFF472B6), // hồng pastel
          Color(0xFFEC4899), // hồng đậm
          Color(0xFFF97316), // cam
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    alignment: Alignment.center,
    child: const Text(
      'E',
      style: TextStyle(
        color: Colors.white,
        fontWeight: FontWeight.w900,
        fontSize: 20,
      ),
    ),
  );
}

