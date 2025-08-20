import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/utils/hex_color.dart';

class BlogCardVertical extends StatelessWidget {
  final BlogResponse blog;
  final VoidCallback onTap;

  const BlogCardVertical({
    super.key,
    required this.blog,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
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
        child: IntrinsicHeight(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Ảnh hero
                Container(
                  width: 120,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    color: AppColors.secondaryGrey,
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Hero(
                      tag: 'blog_image_${blog.id}',
                      child: Image.network(
                        blog.featuredImageUrl ?? AppDefaultImages.defaultImage,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                // Nội dung
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Tags
                        if (blog.tags != null && blog.tags!.isNotEmpty)
                          Wrap(
                            spacing: 6,
                            runSpacing: 4,
                            children: blog.tags!.map((tag) {
                              final Color bgColor =
                                  HexToColor(tag.color).withOpacity(0.2);
                              return Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: bgColor,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  tag.name,
                                  style: textTheme.displaySmall?.copyWith(
                                    color: HexToColor(tag.color),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        const SizedBox(height: 8),
                        // Tiêu đề
                        Text(
                          blog.title,
                          style: textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w900),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        // Nội dung ngắn
                        Text(
                          blog.excerpt ?? blog.content,
                          style: textTheme.bodyMedium?.copyWith(
                            color: AppColors.textGrey,
                          ),
                          maxLines: 4,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        // Thông tin thêm
                        Row(
                          children: [
                            Icon(Icons.access_time,
                                size: 16, color: AppColors.primaryGrey),
                            const SizedBox(width: 4),
                            Text(
                              _formatDate(blog.createdAt),
                              style: textTheme.displayMedium?.copyWith(
                                  color: AppColors.primaryGrey),
                            ),
                            const SizedBox(width: 16),
                            Icon(Icons.visibility,
                                size: 16, color: AppColors.primaryGrey),
                            const SizedBox(width: 4),
                            Text(
                              '${blog.viewCount}',
                              style: textTheme.displayMedium?.copyWith(
                                  color: AppColors.primaryGrey),
                            ),
                            const SizedBox(width: 16),
                            Icon(Icons.favorite_border,
                                size: 16, color: AppColors.primaryGrey),
                            const SizedBox(width: 4),
                            Text(
                              '${blog.likeCount}',
                              style: textTheme.displayMedium?.copyWith(
                                  color: AppColors.primaryGrey),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final dt = DateTime.parse(dateStr);
      final now = DateTime.now();
      final diff = now.difference(dt);
      if (diff.inMinutes < 60) return '${diff.inMinutes} phút trước';
      if (diff.inHours < 24) return '${diff.inHours} giờ trước';
      if (diff.inDays < 7) return '${diff.inDays} ngày trước';
      return '${dt.day}/${dt.month}/${dt.year}';
    } catch (_) {
      return '';
    }
  }
}
