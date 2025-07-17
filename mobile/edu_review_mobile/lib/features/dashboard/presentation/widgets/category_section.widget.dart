// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';

class CategorySection extends StatelessWidget {
  const CategorySection({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = [
      {
        'name': 'Engineering',
        'icon': Icons.engineering,
        'color': AppColors.primaryBlue,
      },
      {
        'name': 'Business',
        'icon': Icons.business,
        'color': AppColors.primaryGreen,
      },
      {
        'name': 'Medicine',
        'icon': Icons.medical_services,
        'color': AppColors.primaryRed,
      },
      {
        'name': 'Arts',
        'icon': Icons.palette,
        'color': AppColors.primaryOrange,
      },
      {
        'name': 'Science',
        'icon': Icons.science,
        'color': AppColors.purple400,
      },
      {
        'name': 'Technology',
        'icon': Icons.computer,
        'color': AppColors.blue400,
      },
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Browse by Category',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontSize: 20,
            ),
          ),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: categories.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 0.8,
            ),
            itemBuilder: (context, index) {
              final category = categories[index];
              return _buildCategoryCard(
                context: context,
                name: category['name'] as String,
                icon: category['icon'] as IconData,
                color: category['color'] as Color,
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard({
    required BuildContext context,
    required String name,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.55),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.10),
            blurRadius: 14,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            // TODO: handle tap
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.13),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: color, size: 32),
                ),
                const SizedBox(height: 12),
                Text(
                  name,
                  style: Theme.of(context).textTheme.displayMedium,
                  textAlign: TextAlign.center,
                  overflow: TextOverflow.ellipsis,
                  maxLines: 2,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
