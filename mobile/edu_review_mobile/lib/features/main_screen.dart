// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/features/settings/presentation/pages/settings.page.dart';
import 'package:flutter/material.dart';
import 'package:edu_review_mobile/features/dashboard/presentation/pages/dashboard.page.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/pages/profile.page.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user_display_cubit.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent_bottom_nav_bar_v2.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class NewsPage extends StatelessWidget {
  const NewsPage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('News Page'));
  }
}

class ExplorePage extends StatelessWidget {
  const ExplorePage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Explore Page'));
  }
}

class _MainScreenState extends State<MainScreen> {
  final List<PersistentTabConfig> _tabs = [
    PersistentTabConfig(
      screen: const DashboardPage(),
      item: ItemConfig(
        icon: const Icon(Icons.home_filled),
        title: '',
        activeForegroundColor: AppColors.primaryBlue,
        inactiveForegroundColor: Colors.grey,
      ),
    ),
    PersistentTabConfig(
      screen: const NewsPage(),
      item: ItemConfig(
        icon: const Icon(Icons.newspaper),
        title: '',
        activeForegroundColor: AppColors.primaryBlue,
        inactiveForegroundColor: AppColors.primaryGrey,
      ),
    ),
    PersistentTabConfig(
      screen: const ExplorePage(),
      item: ItemConfig(
        icon: const Icon(Icons.explore),
        title: '',
        activeForegroundColor: AppColors.primaryBlue,
        inactiveForegroundColor: AppColors.primaryGrey,
      ),
    ),
    PersistentTabConfig(
      screen: const ProfilePage(),
      item: ItemConfig(
        icon: const Icon(Icons.person),
        title: '',
        activeForegroundColor: AppColors.primaryBlue,
        inactiveForegroundColor: AppColors.primaryGrey,
      ),
    ),
    PersistentTabConfig(
      screen: const SettingsPage(),
      item: ItemConfig(
        icon: const Icon(Icons.settings),
        title: '',
        activeForegroundColor: AppColors.primaryBlue,
        inactiveForegroundColor: AppColors.primaryGrey,
      ),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => UserDisplayCubit()..displayUser(),
      child: PersistentTabView(
        tabs: _tabs,
        navBarBuilder: (navBarConfig) {
          final selectedIndex = navBarConfig.selectedIndex;
          return Container(
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.primaryWhite,
              border: Border(
                top: BorderSide(color: AppColors.secondaryGrey, width: 0.4),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(navBarConfig.items.length, (index) {
                final item = navBarConfig.items[index];
                final isSelected = index == selectedIndex;
                return Expanded(
                  child: GestureDetector(
                    onTap: () => navBarConfig.onItemSelected(index),
                    behavior: HitTestBehavior.opaque,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          height: 3,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color:
                                isSelected
                                    ? AppColors.primaryBlue
                                    : Colors.transparent,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(height: 10),
                        IconTheme(
                          data: IconThemeData(
                            size: 28,
                            color:
                                isSelected
                                    ? AppColors.primaryBlue
                                    : Colors.grey,
                          ),
                          child: item.icon,
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ),
          );
        },
      ),
    );
  }
}
