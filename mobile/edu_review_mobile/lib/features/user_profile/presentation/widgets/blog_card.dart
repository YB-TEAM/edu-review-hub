import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';

class BlogCard extends StatelessWidget {
  final BlogResponse blog;
  final VoidCallback onTap;

  const BlogCard({super.key, required this.blog, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(blog.featuredImageUrl ??  AppDefaultImages.defaultAvatar, fit: BoxFit.cover),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(blog.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text(blog.excerpt ?? '', maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Text("By ${blog.authorName} • ${blog.publishedAt?.toLocal().toString().split(' ')[0]}", style: const TextStyle(fontSize: 12, color: Colors.grey)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
  