import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/utils/date_formatted.dart';
import 'package:edu_review_mobile/core/utils/hex_color.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:markdown_widget/config/all.dart';

class BlogCard extends StatelessWidget {
  final BlogResponse blog;
  final VoidCallback onTap;

  const BlogCard({super.key, required this.blog, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.primaryWhite,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: AppColors.secondaryGrey,
              width: 1, 
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  blog.featuredImageUrl ?? AppDefaultImages.defaultImage,
                  fit: BoxFit.cover,
                  width: double.infinity,
                  height: 160,
                ),
              ),
              const SizedBox(height: 16),
              if (blog.tags != null && blog.tags!.isNotEmpty)
                Column(
                  children: [
                    Wrap(
                      spacing: 8,
                      runSpacing: 12,
                      children: blog.tags!.map((tag) {
                        final Color bgColor = HexToColor(tag.color);
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: bgColor.toOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            tag.name,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: bgColor,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    blog.title,
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 6),
                  if (blog.excerpt != null && blog.excerpt!.isNotEmpty)
                    Text(
                      blog.excerpt!,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: AppColors.textGrey,
                      ),
                    ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      SvgPicture.asset(AppIcons.userActive, width: 24, height: 24, color: AppColors.primaryGrey),
                      const SizedBox(width: 8),
                      Container(
                        constraints: const BoxConstraints(maxWidth: 80),
                        child: Text(
                          blog.authorName ?? 'Unknown Author', 
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppColors.textGrey,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Text(
                          formatDate(blog.createdAt),
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.w500,
                            color: AppColors.textGrey,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primaryBlue,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          blog.status,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textWhite,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
