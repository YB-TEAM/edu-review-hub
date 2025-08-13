import 'package:edu_review_mobile/common/constants/app_default_images.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';
import 'package:edu_review_mobile/core/utils/date_formatted.dart';
import 'package:edu_review_mobile/core/utils/hex_color.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/delete_blog_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/delete_blog_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_svg/svg.dart';

class MyBlogDetailPage extends StatelessWidget {
  final BlogResponse blog;

  const MyBlogDetailPage({super.key, required this.blog});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => DeleteBlogCubit(),
      child: Scaffold(
        appBar: CustomAppBar(
          title: "Blog Detail",
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
                      if (blog.tags != null && blog.tags!.isNotEmpty)
                        Column(
                          children: [
                            Wrap(
                              spacing: 8,
                              runSpacing: 12,
                              children: blog.tags!.map((tag) {
                                final Color bgColor = HexToColor(tag.color);
                                return Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: bgColor,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    tag.name,
                                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: AppColors.primaryWhite,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                            const SizedBox(height: 12),
                          ],
                        ),
                      Text(blog.title, style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                        wordSpacing: 2.0
                      )),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          SvgPicture.asset('assets/icons/ic_user_active.svg', width: 24, height: 24, color: AppColors.primaryGrey),
                          const SizedBox(width: 8),
                          Container(
                            constraints: const BoxConstraints(maxWidth: 150), 
                            child: Text(
                              blog.authorName ?? "Unknow Author",
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                                color: AppColors.textGrey,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(
                              formatDate(blog.createdAt),
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w500,
                                color: AppColors.textGrey,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          blog.featuredImageUrl ?? AppDefaultImages.defaultImage,
                          fit: BoxFit.cover,
                        ),
                      ),
                      const SizedBox(height: 20),
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
                              final deleteCubit = context.read<DeleteBlogCubit>(); 
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
                                        deleteCubit.deleteBlog(blog.id); 
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
