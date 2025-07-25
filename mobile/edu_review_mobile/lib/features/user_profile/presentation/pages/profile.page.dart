import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/constants/app_default_images.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/widgets/loading/custom_loading_indicator.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/utils/date_formatted.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user_display_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user_display_state.dart';
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

  void _onRefresh() async {
    setState(() => _isRefreshing = true);
    await context.read<UserDisplayCubit>().reloadUser();
    setState(() => _isRefreshing = false);
    _refreshController.refreshCompleted();
  }

  @override
  void dispose() {
    _refreshController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    void navigateToEditProfile(BuildContext context) async {
      await Navigator.of(
        context,
        rootNavigator: true,
      ).pushNamed(RouteConstant.editProfile);
      if (mounted) {
        context.read<UserDisplayCubit>().reloadUser();
      }
    }

    return MultiBlocProvider(
      providers: [BlocProvider(create: (context) => ButtonStateCubit())],
      child: BlocListener<ButtonStateCubit, ButtonState>(
        listener: (context, state) {},
        child: Scaffold(
          backgroundColor: AppColors.backgroundGrey,
          body: Stack(
            children: [
              BlocBuilder<UserDisplayCubit, UserDisplayState>(
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
                                  imageUrl: state.profileEntity.coverImageUrl ?? AppDefaultImages.defaultCover,
                                  onChangeCover: () {
                                    print('Nhấn đổi ảnh bìa');
                                  },
                                  child: EditAvatarButton(
                                    imageUrl: state.profileEntity.avatarUrl ?? AppDefaultImages.defaultAvatar,
                                    size: 128,
                                    onPressed: () {
                                      print('Nhấn đổi avatar');
                                    },
                                  ),
                                ),
                                const SizedBox(height: 64),
                                Center(
                                  child: Text(
                                    state.profileEntity.displayName ?? '',
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineSmall
                                        ?.copyWith(fontWeight: FontWeight.w700),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                if (state.profileEntity.bio != null &&
                                    state.profileEntity.bio!.isNotEmpty) ...[
                                  Center(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 32,
                                      ),
                                      child: Text(
                                        state.profileEntity.bio!,
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
                                      'Studient',
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
                                      'Joined ${formatDate(state.profileEntity.createdAt)}',
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
                                    title: "Edit Public Details",
                                    icon: Icon(
                                      Icons.edit,
                                      color: AppColors.primaryWhite,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                          Column(
                            children: [
                              AccountInfoWidget(
                                city: state.profileEntity.city,
                                universityName:
                                    state.profileEntity.universityName,
                                major: state.profileEntity.major,
                                graduationYear:
                                    state.profileEntity.graduationYear,
                                onSeeMorePressed: () {
                                  Navigator.pushNamed(
                                    context,
                                    RouteConstant.detailProfile,
                                    arguments: state.profileEntity,
                                  );
                                },
                              ),
                              const SizedBox(height: 16),
                              AchievementsWidget(
                                posts: 25,
                                likes: 150,
                                points: 750,
                                level: 5,
                                totalPoints: 1000,
                              ),
                              const SizedBox(height: 24),
                            ],
                          ),
                        ],
                      ),
                    );
                  }
                  if (state is LoadUserFailure) {
                    return Text(state.errorMessage);
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
