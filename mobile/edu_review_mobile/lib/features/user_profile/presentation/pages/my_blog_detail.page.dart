import 'package:edu_review_mobile/common/constants/app_default_images.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/delete_blog_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/delete_blog_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
// ... các import khác

class MyBlogDetailPage extends StatelessWidget {
  final BlogResponse blog;

  const MyBlogDetailPage({super.key, required this.blog});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => DeleteBlogCubit(),
      child: Scaffold(
        appBar: CustomAppBar(
          title: blog.title,
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
                      Image.network(
                        blog.featuredImageUrl ?? AppDefaultImages.defaultImage,
                        fit: BoxFit.cover,
                      ),
                      const SizedBox(height: 16),
                      Text(blog.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 8),
                      Text("By ${blog.authorName} • ${blog.publishedAt?.toString().split(' ')[0]}"),
                      const SizedBox(height: 16),
                      MarkdownBody(data: blog.content),
                    ],
                  ),
                ),
              ),

              BlocListener<DeleteBlogCubit, DeleteBlogState>(
                listener: (context, state) {
                  if (state is DeleteBlogSuccess) {
                    Navigator.of(context).pop(true);
                  } else if (state is DeleteBlogFailure) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(state.errorMessage)),
                    );
                  }
                },
                child: BlocBuilder<DeleteBlogCubit, DeleteBlogState>(
                  builder: (context, state) {
                    final isLoading = state is DeleteBlogLoading;
                    return SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        onPressed: isLoading
                          ? null
                          : () {
                              final deleteCubit = context.read<DeleteBlogCubit>(); // lấy cubit trước khi gọi dialog
                              showDialog(
                                context: context,
                                builder: (dialogContext) => AlertDialog(
                                  title: const Text('Confirm Delete'),
                                  content: const Text('Are you sure you want to delete this blog?'),
                                  actions: [
                                    TextButton(
                                      onPressed: () => Navigator.of(dialogContext).pop(),
                                      child: const Text('Cancel'),
                                    ),
                                    TextButton(
                                      onPressed: () {
                                        Navigator.of(dialogContext).pop();
                                        deleteCubit.deleteBlog(blog.id); // dùng cubit lấy được bên ngoài
                                      },
                                      child: const Text('Delete'),
                                    ),
                                  ],
                                ),
                              );
                            },

                        child: isLoading
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Text(
                                'Delete Blog',
                                style: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
