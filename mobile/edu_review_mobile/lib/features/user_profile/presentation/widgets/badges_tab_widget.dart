// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';

class BadgesTabWidget extends StatefulWidget {
  BadgesTabWidget({super.key});

  @override
  State<BadgesTabWidget> createState() => _BadgesTabWidgetState();
}

class _BadgesTabWidgetState extends State<BadgesTabWidget> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, dynamic>> _badges = [
    {
      'name': 'Newbie',
      'description': 'Complete first post',
      'icon': Icons.rocket_launch_rounded,
      'colors': [AppColors.blue400, AppColors.blue600],
      'unlocked': true,
    },
    {
      'name': 'Sharer',
      'description': 'Post 10 articles',
      'icon': Icons.share_rounded,
      'colors': [AppColors.green400, AppColors.green600],
      'unlocked': true,
    },
    {
      'name': 'Popular',
      'description': 'Receive 100 likes',
      'icon': Icons.local_fire_department_rounded,
      'colors': [AppColors.orange400, AppColors.orange600],
      'unlocked': true,
    },
    {
      'name': 'Expert',
      'description': 'Reach 1000 points',
      'icon': Icons.psychology_rounded,
      'colors': [AppColors.purple400, AppColors.purple600],
      'unlocked': false,
    },
    {
      'name': 'Legend',
      'description': 'Reach level 10',
      'icon': Icons.auto_awesome_rounded,
      'colors': [AppColors.primaryRed, AppColors.primaryRed],
      'unlocked': false,
    },
    {
      'name': 'Creator',
      'description': 'Create 50 quality posts',
      'icon': Icons.lightbulb_rounded,
      'colors': [AppColors.amber400, AppColors.amber600],
      'unlocked': false,
    },
  ];

  List<List<Map<String, dynamic>>> get _badgePages {
    List<List<Map<String, dynamic>>> pages = [];
    for (int i = 0; i < _badges.length; i += 4) {
      pages.add(
        _badges.sublist(i, i + 4 > _badges.length ? _badges.length : i + 4),
      );
    }
    return pages;
  }

  @override
  Widget build(BuildContext context) {
    final pages = _badgePages;
    return Column(
      children: [
        SizedBox(
          height: 340,
          child: PageView.builder(
            controller: _pageController,
            itemCount: pages.length,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemBuilder: (context, pageIndex) {
              final pageBadges = pages[pageIndex];
              return GridView.builder(
                padding: EdgeInsets.symmetric(horizontal: 10),
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.8,
                ),
                itemCount: pageBadges.length,
                itemBuilder: (context, index) {
                  final badge = pageBadges[index];
                  return _buildBadgeCard(context, badge, index);
                },
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        if (pages.length > 1)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              pages.length,
              (index) => AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.symmetric(horizontal: 4),
                width: _currentPage == index ? 16 : 8,
                height: 8,
                decoration: BoxDecoration(
                  color:
                      _currentPage == index
                          ? Theme.of(context).colorScheme.primary
                          : Theme.of(
                            context,
                          ).colorScheme.primary.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildBadgeCard(
    BuildContext context,
    Map<String, dynamic> badge,
    int index,
  ) {
    final isUnlocked = badge['unlocked'] as bool;
    final colors = badge['colors'] as List<Color>;

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors:
              isUnlocked
                  ? [colors[0].withOpacity(0.1), colors[1].withOpacity(0.05)]
                  : [
                    Theme.of(
                      context,
                    ).colorScheme.surfaceVariant.withOpacity(0.3),
                    Theme.of(
                      context,
                    ).colorScheme.surfaceVariant.withOpacity(0.1),
                  ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color:
              isUnlocked
                  ? colors[0].withOpacity(0.2)
                  : Theme.of(context).colorScheme.outline.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              gradient: isUnlocked ? LinearGradient(colors: colors) : null,
              color:
                  isUnlocked
                      ? null
                      : Theme.of(context).colorScheme.surfaceVariant,
              borderRadius: BorderRadius.circular(12),
              boxShadow:
                  isUnlocked
                      ? [
                        BoxShadow(
                          color: colors[0].withOpacity(0.3),
                          blurRadius: 6,
                          offset: const Offset(0, 3),
                        ),
                      ]
                      : null,
            ),
            child: Icon(
              badge['icon'] as IconData,
              color:
                  isUnlocked
                      ? AppColors.primaryWhite
                      : Theme.of(
                        context,
                      ).colorScheme.onSurface.withOpacity(0.3),
              size: 24,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            badge['name'] as String,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
              color:
                  isUnlocked
                      ? Theme.of(context).colorScheme.onSurface
                      : Theme.of(
                        context,
                      ).colorScheme.onSurface.withOpacity(0.5),
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            badge['description'] as String,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color:
                  isUnlocked
                      ? Theme.of(context).colorScheme.onSurface.withOpacity(0.6)
                      : Theme.of(
                        context,
                      ).colorScheme.onSurface.withOpacity(0.3),
              fontSize: 10,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
