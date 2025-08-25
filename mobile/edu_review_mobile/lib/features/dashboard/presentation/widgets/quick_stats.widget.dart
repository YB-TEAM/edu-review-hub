// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/flutter_svg.dart';

class QuickStats extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Số Liệu Nổi Bật',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontSize: 20,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  context: context,
                  icon: AppIcons.university,
                  title: 'Đại học',
                  value: '2,847',
                  color: AppColors.primaryBlue,
                  highlight: true,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildStatCard(
                  context: context,
                  icon: AppIcons.users,
                  title: 'Sinh viên',
                  value: '45.2K',
                  color: AppColors.primaryGreen,
                  highlight: true,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildStatCard(
                  context: context,
                  icon: AppIcons.star,
                  title: 'Đánh giá',
                  value: '12.8K',
                  color: AppColors.primaryOrange,
                  highlight: true,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required BuildContext context,
    required String icon,
    required String title,
    required String value,
    required Color color,
    required bool highlight,
  }) {
    Color secondaryColor;
    if (color == AppColors.primaryBlue) {
      secondaryColor = const Color(0xFF64B5F6);
    } else if (color == AppColors.primaryGreen) {
      secondaryColor = const Color(0xFF81C784);
    } else if (color == AppColors.primaryOrange) {
      secondaryColor = const Color(0xFFFFB74D);
    } else {
      secondaryColor = AppColors.primaryWhite.withOpacity(0.85);
    }

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            color.withOpacity(0.98),
            secondaryColor.withOpacity(0.95),
            color.withOpacity(0.85),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.13),
            blurRadius: highlight ? 18 : 10,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.22),
              borderRadius: BorderRadius.circular(8),
            ),
            child: SvgPicture.asset(
              icon,
              colorFilter: const ColorFilter.mode(Colors.white, BlendMode.srcIn),
              width: 28,
              height: 28,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            value,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              shadows: [
                Shadow(
                  color: color.withOpacity(0.35),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
          ),
          const SizedBox(height: 6),
          Text(
            title,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
              shadows: [
                Shadow(
                  color: color.withOpacity(0.25),
                  blurRadius: 6,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
