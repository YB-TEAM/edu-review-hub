import 'package:edu_review_mobile/common/widgets/button/custom_like_button.dart';
import 'package:edu_review_mobile/core/utils/number_formatter.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/utils/hex_color.dart';
import 'package:flutter_svg/svg.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/reaction_blog.dart';
import 'package:edu_review_mobile/service_locator.dart';

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
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(12),
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
                child: Container(
                  width: double.infinity,
                  height: 160,
                  color: AppColors.secondaryGrey,
                  child: Hero(
                    tag: 'blog_image_${blog.id}',
                    child: Image.network(
                      blog.featuredImageUrl ?? AppDefaultImages.defaultImage,
                      fit: BoxFit.contain,
                      width: double.infinity,
                      height: 160,
                    ),
                  ),
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
                            color: bgColor.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            tag.name,
                            style: textTheme.bodySmall?.copyWith(
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
              Text(
                blog.title,
                style: textTheme.headlineSmall,
              ),
              const SizedBox(height: 6),
              if (blog.excerpt != null && blog.excerpt!.isNotEmpty)
                Text(
                  blog.excerpt!,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: textTheme.bodyLarge?.copyWith(
                    color: AppColors.textGrey,
                  ),
                ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.person, size: 24, color: AppColors.primaryGrey),
                      const SizedBox(width: 8),
                      Container(
                        constraints: const BoxConstraints(maxWidth: 150),
                        child: Text(
                          blog.authorName ?? 'Tác giả không xác định',
                          style: textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppColors.textGrey,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 16),
                  Text(
                    _formatDate(blog.createdAt),
                    style: textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                      color: AppColors.textGrey,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: Row(
                  children: [
                    CustomLikeButton(
                      likeCount: blog.likeCount,
                      isLiked: blog.isLiked == true,
                      onTap: (isLiked) async {
                        await sl<ReactionBlogUseCase>().call(blog.id);
                      },
                    ),
                    const SizedBox(width: 40),
                    GestureDetector(
                      onTap: () {
                        print('Bình luận được bấm');
                      },
                      child: Row(
                        children: [
                          SvgPicture.asset(
                            AppIcons.comment,
                            width: 20,
                            height: 20,
                            color: AppColors.primaryGrey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            formatNumber(blog.commentCount),
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textGrey,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 40),
                    Row(
                      children: [
                        SvgPicture.asset(
                          AppIcons.eye,
                          width: 20,
                          height: 20,
                          color: AppColors.primaryGrey,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          formatNumber(blog.viewCount),
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textGrey,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 40),
                    GestureDetector(
                      onTap: () {
                        print('Chia sẻ được bấm');
                      },
                      child: SvgPicture.asset(
                        AppIcons.share,
                          width: 20,
                          height: 20,
                          color: AppColors.primaryGrey,
                        ),
                    ),
                  ],
                ),
              ),
            ],
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
