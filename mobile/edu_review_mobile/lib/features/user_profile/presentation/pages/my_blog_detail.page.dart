import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/utils/date_formatted.dart';
import 'package:edu_review_mobile/core/utils/hex_color.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/blog/delete_blog_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/blog/delete_blog_state.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/blog/publish_blog_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/blog/publish_blog_state.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/pages/edit_blog.page.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_svg/svg.dart';

class MyBlogDetailPage extends StatelessWidget {
  final BlogResponse blog;

  const MyBlogDetailPage({super.key, required this.blog});

   void _showSuccessDialog(BuildContext context, String message) {
    showAppDialog(
      context: context,
      title: 'Success',
      content: message,
      icon: Icons.check_circle,
      iconColor: Colors.green,
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (context.mounted) Navigator.of(context).pop();
            });
          },
          child: const Text('OK'),
        ),
      ],
    );
  }

  void _showErrorDialog(BuildContext context, String title, String message) {
    showAppDialog(
      context: context,
      title: title,
      content: 'Error: $message',
      icon: Icons.error,
      iconColor: Colors.red,
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Close'),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => DeleteBlogCubit()),
        BlocProvider(create: (_) => UserPublishBlogCubit()),
      ],
      child: Scaffold(
        appBar: CustomAppBar(
          title: "Blog Detail",
          onBackPressed: () => Navigator.of(context).maybePop(),
          actions: [
            if (blog.status == 'draft') 
              IconButton(
                icon: const Icon(Icons.edit, color: AppColors.primaryBlack),
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => EditBlogPage(blog: blog), 
                    ),
                  );
                },
              ),
          ],
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
                      Text(
                        blog.title,
                        style: Theme.of(context)
                            .textTheme
                            .headlineLarge
                            ?.copyWith(wordSpacing: 2.0),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          SvgPicture.asset(
                            AppIcons.userActive,
                            width: 24,
                            height: 24,
                            color: AppColors.primaryGrey,
                          ),
                          const SizedBox(width: 8),
                          Container(
                            constraints: const BoxConstraints(maxWidth: 150),
                            child: Text(
                              blog.authorName ?? "Unknown Author",
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
              MultiBlocListener(
                listeners: [
                  BlocListener<DeleteBlogCubit, DeleteBlogState>(
                    listener: (context, state) {
                      if (state is DeleteBlogSuccess) {
                        _showSuccessDialog(context, 'Delete Blog successfully!');
                      } else if (state is DeleteBlogFailure) {
                        _showErrorDialog(context, 'Delete Blog Failed', state.errorMessage);
                      }
                    },
                  ),
                  BlocListener<UserPublishBlogCubit, PublishBlogState>(
                    listener: (context, state) {
                      if (state is PublishBlogSuccess) {
                        _showSuccessDialog(context, 'Publish Blog successfully!');
                      } else if (state is PublishBlogFailure) {
                        _showErrorDialog(context, 'Publish Blog Failed', state.errorMessage);
                      }
                    },
                  ),
                ],
                child: Row(
                  children: [
                    BlocBuilder<DeleteBlogCubit, DeleteBlogState>(
                      builder: (context, state) {
                        final isLoading = state is DeleteBlogLoading;
                        return Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.secondaryGrey,
                              minimumSize: const Size(double.infinity, 48),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            onPressed: isLoading
                                ? null
                                : () {
                                    final deleteCubit = context.read<DeleteBlogCubit>();
                                    showAppDialog(
                                      context: context,
                                      title: "Confirm Delete",
                                      content: "Are you sure you want to delete this blog?",
                                      icon: Icons.warning_amber_rounded,
                                      iconColor: Colors.red,
                                      actions: [
                                        TextButton(
                                          onPressed: () => Navigator.of(context).pop(),
                                          child: const Text("Cancel"),
                                        ),
                                        TextButton(
                                          onPressed: () {
                                            Navigator.of(context).pop();
                                            deleteCubit.deleteBlog(blog.id);
                                          },
                                          child: const Text("Delete"),
                                        ),
                                      ],
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
                                : Row(
                                    mainAxisSize: MainAxisSize.min,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        'Delete',
                                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                          color: AppColors.textBlack,
                                          fontWeight: FontWeight.w900,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      SvgPicture.asset(
                                        AppIcons.delete,
                                        color: AppColors.primaryBlack,
                                        width: 20,
                                        height: 20,
                                      ),
                                    ],
                                  ),
                          ),
                        );
                      },
                    ),
                    if (blog.status == 'draft') ...[
                      const SizedBox(width: 12),
                      BlocBuilder<UserPublishBlogCubit, PublishBlogState>(
                        builder: (context, state) {
                          final isPublishing = state is PublishBlogLoading;
                          return Expanded(
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primaryBlue,
                                minimumSize: const Size(double.infinity, 48),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              onPressed: isPublishing
                                  ? null
                                  : () {
                                      context.read<UserPublishBlogCubit>().publishBlog(blog.id);
                                    },
                              child: isPublishing
                                  ? const SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : Row(
                                      mainAxisSize: MainAxisSize.min,
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          'Publish',
                                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                                color: AppColors.primaryWhite,
                                                fontWeight: FontWeight.w900,
                                              ),
                                        ),
                                        const SizedBox(width: 8),
                                        SvgPicture.asset(
                                          AppIcons.publish,
                                          color: AppColors.primaryWhite,
                                          width: 20,
                                          height: 20,
                                        ),
                                      ],
                                    ),
                            ),
                          );
                        },
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

