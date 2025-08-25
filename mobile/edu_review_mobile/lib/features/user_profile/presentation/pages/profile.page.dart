import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/widgets/loading/custom_loading_indicator.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/utils/date_formatted.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/user_display_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/user_display_state.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/user_blog_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/user_blog_state.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_pagination.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/blog_list.widget.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/cover_photo.widget.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/edit_avatar.button.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/achievements.widget.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/account_info.widget.dart';


class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}


class _ProfilePageState extends State<ProfilePage> {
  final RefreshController _refreshController = RefreshController();
  bool _isRefreshing = false;
  final BlogPagination _pagination = BlogPagination(page: 1, limit: 10);
  bool _isLoadingMore = false;

  void _onRefresh() async {
    Navigator.pushReplacementNamed(context, RouteConstant.profile);
  }

  @override
  void dispose() {
    _refreshController.dispose();
    super.dispose();
  }

  void _navigateToDetailProfile(BuildContext context, dynamic profileEntity) async {
    await Navigator.of(context, rootNavigator: true).pushNamed(RouteConstant.detailProfile, arguments: profileEntity);
    if (mounted) {
      context.read<UserCubit>().reloadUser();
    }
  }

  void navigateToEditProfile(BuildContext context) async {
    await Navigator.of(
      context,
      rootNavigator: true,
    ).pushNamed(RouteConstant.editProfile);
    if (mounted) {
      context.read<UserCubit>().reloadUser();
    }
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => UserCubit()..fetchUser()),
        BlocProvider(create: (context) => ButtonStateCubit()),
        BlocProvider(create: (context) => UserBlogCubit()..fetchBlogs(pagination: _pagination)),
      ],
      child: BlocListener<ButtonStateCubit, ButtonState>(
        listener: (context, state) {},
        child: Scaffold(
          backgroundColor: AppColors.backgroundDarkGrey,
          body: Stack(
            children: [
              BlocBuilder<UserCubit, UserState>(
                builder: (context, state) {
                  if (state is UserLoading) {
                    return Center(child: CustomLoadingIndicator());
                  }
                  if (state is UserLoaded) {
                    return SmartRefresher(
                      controller: _refreshController,
                      onRefresh: _onRefresh,
                      header: null,
                      child: ListView(
                        children: [
                          Container(
                            color: AppColors.primaryWhite,
                            child: Column(
                              children: [
                                CoverPhotoWidget(
                                  imageUrl: state.profile.coverImageUrl ?? AppDefaultImages.defaultCover,
                                  onChangeCover: () {
                                    print('Nhấn đổi ảnh bìa');
                                  },
                                  child: EditAvatarButton(
                                    imageUrl: state.profile.avatarUrl ?? AppDefaultImages.defaultAvatar,
                                    size: 128,
                                    onPressed: () {
                                      print('Nhấn đổi avatar');
                                    },
                                  ),
                                ),
                                const SizedBox(height: 64),
                                Center(
                                  child: Text(
                                    state.profile.displayName ?? '',
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineSmall
                                        ?.copyWith(fontWeight: FontWeight.w700),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                if (state.profile.bio != null &&
                                    state.profile.bio!.isNotEmpty) ...[
                                  Center(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 32,
                                      ),
                                      child: Text(
                                        state.profile.bio!,
                                        style: Theme.of(
                                          context,
                                        ).textTheme.bodyLarge?.copyWith(
                                          fontSize: 14,
                                          color: AppColors.primaryBlack
                                              .withOpacity(0.8),
                                          fontStyle: FontStyle.italic,
                                          fontWeight: FontWeight.w500,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                    ),
                                  ),
                                ],
                                const SizedBox(height: 16),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      'Sinh Viên',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(
                                            color: AppColors.textBlue,
                                          ),
                                    ),
                                    const SizedBox(width: 16),
                                    Text(
                                      '|',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(
                                            color: AppColors.textGrey,
                                          ),
                                    ),
                                    const SizedBox(width: 16),
                                    Text(
                                      'Tham gia từ: ${formatDate(state.profile.createdAt)}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(
                                            color: AppColors.textBlack,
                                          ),
                                    ),
                                  ],
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                                  child: PrimaryButton(
                                    onPressed:
                                        () => navigateToEditProfile(context),
                                    title: "Chỉnh sửa trang cá nhân",
                                    icon: Icon(
                                      Icons.edit,
                                      color: AppColors.primaryWhite,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 4),
                          Column(
                            children: [
                              AccountInfoWidget(
                                city: state.profile.city,
                                universityName:
                                    state.profile.universityName,
                                major: state.profile.major,
                                graduationYear:
                                    state.profile.graduationYear,
                                onSeeMorePressed: () => _navigateToDetailProfile(context, state.profile),
                              ),
                              const SizedBox(height: 4),
                              AchievementsWidget(
                                posts: 25,
                                likes: 150,
                                points: 750,
                                level: 5,
                                totalPoints: 1000,
                              ),
                              const SizedBox(height: 4),
                              BlocBuilder<UserBlogCubit, UserBlogState>(
                                builder: (context, blogState) {
                                  if (blogState is UserBlogLoading) {
                                    return const Center(child: CustomLoadingIndicator());
                                  }
                                  if (blogState is UserBlogLoaded) {
                                    return Column(
                                      mainAxisSize: MainAxisSize.max,
                                      children: [
                                        MyBlogList(
                                          key: ValueKey(blogState.blogList.length),
                                          blogs: blogState.blogList,
                                        ),
                                        if (blogState.blogList.length >= blogState.pagination.limit && !blogState.hasReachedEnd)
                                          Container(
                                            width: double.infinity,
                                            color: AppColors.primaryWhite,
                                            child: Padding(
                                              padding: const EdgeInsets.only(bottom: 16),
                                              child: TextButton(
                                                onPressed: _isLoadingMore ? null : () async {
                                                  setState(() => _isLoadingMore = true);
                                                  await context.read<UserBlogCubit>().loadMoreBlogs(blogState.pagination);
                                                  setState(() => _isLoadingMore = false);
                                                },
                                                style: TextButton.styleFrom(
                                                  padding: EdgeInsets.zero,
                                                  minimumSize: Size.zero,
                                                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                                ),
                                                child: _isLoadingMore
                                                    ? SizedBox(
                                                        height: 16,
                                                        width: 16,
                                                        child: CircularProgressIndicator(
                                                          strokeWidth: 2,
                                                          valueColor: AlwaysStoppedAnimation<Color>(AppColors.textBlue),
                                                        ),
                                                      )
                                                    : Text(
                                                        'Tải thêm blog',
                                                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                                          color: AppColors.textBlue,
                                                          fontWeight: FontWeight.w700,
                                                        ),
                                                      ),
                                              ),
                                            ),
                                          ),
                                      ],
                                    );
                                  }
                                  if (blogState is UserBlogError) {
                                    return Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Text('Lỗi: ${blogState.message}', style: const TextStyle(color: Colors.red)),
                                    );
                                  }
                                  return const SizedBox.shrink();
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }
                  if (state is UserError) {
                    return Text(state.message);
                  }
                  return Container();
                },
              ),
              if (_isRefreshing)
                Positioned(top: 16, left: 0, right: 0, child: Container()),
            ],
          ),
        ),
      ),
    );
  }
}
