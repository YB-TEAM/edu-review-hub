import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/utils/date_formatted.dart';
import 'package:edu_review_mobile/core/utils/hex_color.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

class BlogDetailPage extends StatelessWidget {
  final BlogResponse blog;

  const BlogDetailPage({super.key, required this.blog});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Chi tiết Blog',
        onBackPressed: () => Navigator.of(context).maybePop(),
      ),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Tags
                    if (blog.tags != null && blog.tags!.isNotEmpty)
                      Column(
                        children: [
                          Wrap(
                            spacing: 8,
                            runSpacing: 12,
                            children: blog.tags!.map((tag) {
                              final Color bgColor =
                                  HexToColor(tag.color).withOpacity(0.2);
                              return Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: bgColor,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  tag.name,
                                  style: textTheme.labelSmall?.copyWith(
                                    color: HexToColor(tag.color),
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 12),
                        ],
                      ),
                    // Title
                    Text(
                      blog.title,
                      style: textTheme.headlineSmall?.copyWith(wordSpacing: 2),
                    ),
                    const SizedBox(height: 12),
                    // Author + Date
                    Row(
                      children: [
                        const Icon(Icons.person, size: 24, color: Colors.grey),
                        const SizedBox(width: 8),
                        Container(
                          constraints: const BoxConstraints(maxWidth: 150),
                          child: Text(
                            blog.authorName ?? "Tác giả không xác định",
                            style: textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                                color: Colors.grey[700]),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            formatDate(blog.createdAt),
                            style: textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w500,
                                color: Colors.grey[700]),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    // Hero Image
                    if (blog.featuredImageUrl != null)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Hero(
                          tag: 'blog_image_${blog.id}',
                          child: Image.network(
                            blog.featuredImageUrl!,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    const SizedBox(height: 20),
                    // Content
                    MarkdownBody(
                      data: blog.content,
                      styleSheet: MarkdownStyleSheet(
                        p: textTheme.bodyLarge?.copyWith(height: 1.6),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
