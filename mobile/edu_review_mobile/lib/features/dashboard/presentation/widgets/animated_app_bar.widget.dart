// ignore_for_file: deprecated_member_use
import 'package:edu_review_mobile/common/widgets/button/custom_icon_button.dart';
import 'package:flutter/material.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';
import 'package:flutter_svg/svg.dart';

class AnimatedAppBar extends StatefulWidget {
  final VoidCallback? onNotificationTap;

  const AnimatedAppBar({Key? key, this.onNotificationTap}) : super(key: key);

  @override
  State<AnimatedAppBar> createState() => _AnimatedAppBarState();
}

class _AnimatedAppBarState extends State<AnimatedAppBar> {
  @override
  Widget build(BuildContext context) {
    final double expandedHeight = 110;
    final double collapsedHeight =
        MediaQuery.of(context).padding.top + kToolbarHeight;

    return SliverAppBar(
      expandedHeight: expandedHeight,
      floating: false,
      pinned: true,
      backgroundColor: AppColors.primaryBlue,
      elevation: 0,
      automaticallyImplyLeading: false,

      title: Builder(
        builder: (BuildContext context) {
          final FlexibleSpaceBarSettings? settings =
              context
                  .dependOnInheritedWidgetOfExactType<
                    FlexibleSpaceBarSettings
                  >();
          final double currentExtent =
              settings?.currentExtent ?? collapsedHeight;
          final double scrollRatio =
              1 -
              ((currentExtent - collapsedHeight) /
                      (expandedHeight - collapsedHeight))
                  .clamp(0.0, 1.0);

          return Opacity(
            opacity: scrollRatio,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                SvgPicture.asset('assets/icons/ic_university.svg', width: 20, height: 20, color: AppColors.primaryWhite),
                const SizedBox(width: 8),
                Text(
                  'EduReview Hub',
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: AppColors.primaryWhite,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          );  
        },
      ),

      actions: [
        Builder(
          builder: (BuildContext context) {
            final FlexibleSpaceBarSettings? settings =
                context
                    .dependOnInheritedWidgetOfExactType<
                      FlexibleSpaceBarSettings
                    >();
            final double currentExtent =
                settings?.currentExtent ?? collapsedHeight;
            final double scrollRatio =
                1 -
                ((currentExtent - collapsedHeight) /
                        (expandedHeight - collapsedHeight))
                    .clamp(0.0, 1.0);

            return Opacity(
              opacity: scrollRatio,
              child: CustomIconButton(
                isCollapsed: true,
                iconAssetPath: 'assets/icons/ic_notifications_active.svg',
                badgeCount: 3,
                onTap: () {
                  print('Icon tapped!');
                },
              ),
            );
          },
        ),
        const SizedBox(width: 8),
      ],

      flexibleSpace: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double currentExtent = constraints.biggest.height;
          final double scrollRatio =
              1 -
              ((currentExtent - collapsedHeight) /
                      (expandedHeight - collapsedHeight))
                  .clamp(0.0, 1.0);

          return FlexibleSpaceBar(
            titlePadding: EdgeInsets.zero,
            centerTitle: false,

            background: Container(
              decoration: BoxDecoration(
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
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Opacity(
                    opacity: 1.0 - scrollRatio,
                    child: Transform.translate(
                      offset: Offset(
                        0.0,
                        Tween<double>(
                          begin: 0.0,
                          end: -20.0,
                        ).evaluate(AlwaysStoppedAnimation(scrollRatio)),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          CustomIconButton(
                            isCollapsed: false,
                            iconAssetPath: 'assets/icons/ic_university.svg',
                            onTap: () {
                              print('Icon tapped!');
                            },
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'EduReview Hub',
                                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                    color: AppColors.primaryWhite,
                                    wordSpacing: 0.5,
                                  ),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Discover & Review Universities',
                                  style: Theme.of(context).textTheme.displayMedium?.copyWith(
                                    color: AppColors.primaryWhite.withOpacity(0.8),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          CustomIconButton(
                            isCollapsed: false,
                            iconAssetPath: 'assets/icons/ic_notifications_active.svg',
                            badgeCount: 3,
                            onTap: () {
                              print('Icon tapped!');
                            },
                          )
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}