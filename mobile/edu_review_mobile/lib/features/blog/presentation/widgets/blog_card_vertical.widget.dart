import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter/material.dart';

class BlogCardVertical extends StatelessWidget {
  final int index;
  final VoidCallback onTap;

  const BlogCardVertical({
    super.key,
    required this.index,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    print('Rendering BlogCardVertical $index');
    return AnimatedContainer(
      duration: Duration(milliseconds: 300 + (index * 50)),
      curve: Curves.easeOutBack,
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.primaryWhite,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryBlack.withOpacity(0.1),
              blurRadius: 6,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    AppDefaultImages.defaultImage,
                    width: 100,
                    height: 120,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Blog ${index + 1}: Flutter Tips & Tricks',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "Choosing the right university is a life-changing decision. In this blog, we explore some of the world’s most prestigious institutions, from MIT to Oxford, highlighting their unique strengths, campus culture, and academic excellence. Whether you're a prospective student or just curious, join us on a journey through the top places to learn and grow.",
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.textGrey,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(Icons.access_time, size: 16, color: AppColors.primaryGrey),
                          const SizedBox(width: 4),
                          Text(
                            '5 minutes ago',
                            style: TextStyle(fontSize: 12, color: AppColors.primaryGrey),
                          ),
                          const SizedBox(width: 16),
                          Icon(Icons.favorite_border, size: 16, color: AppColors.primaryGrey),
                          const SizedBox(width: 4),
                          Text(
                            '${(index + 1) * 12}',
                            style: TextStyle(fontSize: 12, color: AppColors.primaryGrey),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
