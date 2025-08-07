import 'package:edu_review_mobile/common/constants/app_default_images.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

class BlogDetailPage extends StatelessWidget {
  final BlogResponse blog;

  const BlogDetailPage({super.key, required this.blog});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(blog.title)),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(blog.featuredImageUrl ??  AppDefaultImages.defaultImage, fit: BoxFit.cover),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(blog.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  Text("By ${blog.authorName} • ${blog.publishedAt?.toLocal().toString().split(' ')[0]}"),
                  const SizedBox(height: 16),
                  MarkdownBody(data: blog.content), 
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
