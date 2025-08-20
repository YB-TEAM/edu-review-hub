import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/blog_card.dart';

class MyBlogList extends StatelessWidget {
  final List<BlogResponse> blogs;
  

  const MyBlogList({super.key, required this.blogs});

  void navigateToMyBlogDetail(BuildContext context, BlogResponse blog) async {
    await Navigator.of(
      context,
      rootNavigator: true,
    ).pushNamed(RouteConstant.myBlogDetail, arguments: blog);
  }

  @override
  Widget build(BuildContext context) {
    if (blogs.isEmpty) {
      return Container();
    }

    return Container(
      decoration: BoxDecoration(
        color: AppColors.primaryWhite,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Blog của tôi",
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            ListView.builder(
              padding: EdgeInsets.zero,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: blogs.length,
              itemBuilder: (context, index) {
                final blog = blogs[index];
                return BlogCard(
                  blog: blog,
                  onTap: () => navigateToMyBlogDetail(context, blog),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
