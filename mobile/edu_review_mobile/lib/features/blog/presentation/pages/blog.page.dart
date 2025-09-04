import 'dart:io';
import 'package:edu_review_mobile/common/widgets/loading/custom_loading_indicator.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/get_blog_cubit.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/get_blog_state.dart';
import 'package:edu_review_mobile/features/blog/presentation/pages/blog_detail.page.dart';
import 'package:edu_review_mobile/features/blog/presentation/widgets/blog_card_vertical.widget.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar_delegate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';

class BlogPage extends StatelessWidget {
  const BlogPage({super.key});

  void _openBlogPost(BuildContext context, int blogId) {
    Navigator.push(
      context,
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 500),
        pageBuilder: (context, animation, secondaryAnimation) =>
            BlogDetailPage(blogId: blogId),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          final curvedAnimation =
              CurvedAnimation(parent: animation, curve: Curves.easeInOut);
          return FadeTransition(
            opacity: curvedAnimation,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0.05, 0),
                end: Offset.zero,
              ).animate(curvedAnimation),
              child: child,
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final statusBarHeight = MediaQuery.of(context).padding.top;
    final ScrollController _scrollController = ScrollController();

    return BlocProvider(
      create: (_) => GetBlogCubit()..fetchBlogs(),
      child: BlocListener<GetBlogCubit, BlogState>(
        listener: (context, state) {
          if (state is BlogError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Lỗi: ${state.message}')),
            );
          }
        },
        child: Scaffold(
          backgroundColor: AppColors.backgroundGrey,
          body: CustomScrollView(
            controller: _scrollController
              ..addListener(() {
                final cubit = context.read<GetBlogCubit>();
                final state = cubit.state;
                if (_scrollController.position.pixels >=
                        _scrollController.position.maxScrollExtent - 200 &&
                    state is BlogLoaded) {
                  cubit.loadMoreBlogs(state.pagination);
                }
              }),
            physics: Platform.isIOS
                ? const BouncingScrollPhysics()
                : const ClampingScrollPhysics(),
            slivers: [
              SliverPersistentHeader(
                pinned: true,
                floating: false,
                delegate: CustomAppBar(
                  statusBarHeight: statusBarHeight,
                  title: 'Blog – Học hỏi và Trải nghiệm',
                  hintText: 'Tìm kiếm blog, bài viết...',
                ),
              ),
              SliverToBoxAdapter(
                child: BlocBuilder<GetBlogCubit, BlogState>(
                  builder: (context, state) {
                    if (state is BlogLoading) {
                      return const Center(child: CustomLoadingIndicator());
                    } else if (state is BlogLoaded) {
                      final blogs = state.blogList.data;
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ...blogs.map(
                              (blog) => BlogCardVertical(
                                blog: blog,
                                onTap: () => _openBlogPost(context, blog.id),
                              ),
                            ),
                            const SizedBox(height: 30),
                          ],
                        ),
                      );
                    } else if (state is BlogError) {
                      return Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text(
                          'Lỗi: ${state.message}',
                          style: const TextStyle(color: Colors.red),
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),
              ),
            ],
          ),
          floatingActionButton: FloatingActionButton(
            heroTag: null,
            onPressed: () => Navigator.of(context, rootNavigator: true).pushNamed(RouteConstant.createBlog),
            backgroundColor: AppColors.primaryBlue,
            elevation: 8,
            child: SvgPicture.asset(
              AppIcons.pencil,
              height: 24,
              width: 24,
              color: Colors.white,
            )
          ),
        ),
      ),
    );
  }
}
