import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common_libs.dart';

class BlogDetailPage extends StatelessWidget {
  final int index;

  const BlogDetailPage({super.key, required this.index});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Blog ${index + 1}',
        onBackPressed: () => Navigator.of(context).maybePop(),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Hero(
              tag: 'blog_image_$index',
              child: Container(
                width: double.infinity,
                height: 200,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: LinearGradient(
                    colors: [
                      Colors.blue.withOpacity(0.7),
                      Colors.purple.withOpacity(0.7),
                    ],
                  ),
                ),
                child: const Icon(
                  Icons.article,
                  color: Colors.white,
                  size: 64,
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Blog ${index + 1}: Flutter Tips & Tricks',
               style: Theme.of(context).textTheme.headlineSmall
            ),
            const SizedBox(height: 16),
            Text(
              'Content goes here. This is a detailed blog post about Flutter development, covering various tips and tricks to enhance your skills and productivity.',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                height: 1.6,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
