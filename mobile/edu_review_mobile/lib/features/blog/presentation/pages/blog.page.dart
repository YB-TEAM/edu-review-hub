import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/blog/presentation/pages/blog_detail.page.dart';
import 'package:edu_review_mobile/features/blog/presentation/widgets/blog_card_horizontal.widget.dart';
import 'package:edu_review_mobile/features/blog/presentation/widgets/blog_card_vertical.widget.dart';
import 'package:edu_review_mobile/features/blog/presentation/widgets/custom_appbar_widget.dart';

class BlogPage extends StatefulWidget {
  const BlogPage({super.key});

  @override
  State<BlogPage> createState() => _BlogPageState();
}

class _BlogPageState extends State<BlogPage> {
  final ScrollController _scrollController = ScrollController();
  double scrollOffset = 0.0;

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundGrey,
      body: NotificationListener<ScrollNotification>(
        onNotification: (scrollNotification) {
          if (scrollNotification is ScrollUpdateNotification) {
            setState(() {
              scrollOffset = scrollNotification.metrics.pixels;
            });
          }
          return false;
        },
        child: CustomScrollView(
          controller: _scrollController,
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverPersistentHeader(
              pinned: true,
              floating: false,
              delegate: CustomAppBar(
                statusBarHeight: MediaQuery.of(context).padding.top,
              ),
            ),


            _buildBlogContent(),
          ],
        ),
      ),
    );
  }

  Widget _buildBlogContent() {
    return SliverList(
      delegate: SliverChildListDelegate([
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Recommended Blogs', style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 4),
              Text(
                'Honest opinions. Real stories. Smarter decisions.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textGrey,
                    ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 300,
          child: ListView.builder(
            clipBehavior: Clip.none,
            scrollDirection: Axis.horizontal,
            itemCount: 5,
            padding: const EdgeInsets.only(left: 12),
            itemBuilder: (context, index) {
              return Padding(
                padding: EdgeInsets.only(right: index == 4 ? 16 : 12),
                child: BlogCardHorizontal(
                  index: index,
                  onTap: () => _openBlogPost(index),
                ),
              );
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(left: 12, right: 12, bottom: 8, top: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('All Blog Posts', style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 4),
              Text(
                'Browse all insightful reviews and experiences.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textGrey,
                    ),
              ),
            ],
          ),
        ),
        ...List.generate(
          10,
          (index) => BlogCardVertical(
            index: index,
            onTap: () => _openBlogPost(index),
          ),
        ),
        const SizedBox(height: 30),
      ]),
    );
  }

  void _openBlogPost(int index) {
    Navigator.push(
      context,
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 500),
        pageBuilder: (context, animation, secondaryAnimation) => BlogDetailPage(index: index),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          final curvedAnimation = CurvedAnimation(parent: animation, curve: Curves.easeInOutCubic);
          return FadeTransition(
            opacity: curvedAnimation,
            child: SlideTransition(
              position: Tween<Offset>(begin: const Offset(0.1, 0), end: Offset.zero).animate(curvedAnimation),
              child: child,
            ),
          );
        },
      ),
    );
  }
}
