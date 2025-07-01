import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/constants/route.constant.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user_display_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user_display_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/cover_photo_widget.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/edit_avatar_button.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/achievements_widget.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    void navigateToEditProfile(BuildContext context) {
      Navigator.pushNamed(context, RouteConstant.editProfile);
    }

    return MultiBlocProvider(
      providers: [BlocProvider(create: (context) => ButtonStateCubit())],
      child: BlocListener<ButtonStateCubit, ButtonState>(
        listener: (context, state) {
          // Nếu cần xử lý trạng thái động cho nút Edit Profile, thêm logic ở đây
        },
        child: Scaffold(
          body: Center(
            child: BlocBuilder<UserDisplayCubit, UserDisplayState>(
              builder: (context, state) {
                if (state is UserLoading) {
                  return CircularProgressIndicator();
                }
                if (state is UserLoaded) {
                  final coverImageUrl =
                      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=pexels-souvenirpixels-417074.jpg&fm=jpg';
                  final avatarImageUrl =
                      'https://media.baoquangninh.vn/upload/image/202405/medium/2218989_0f59e5d0a690afc333d094905d8a3d5c.jpg';
                  return SingleChildScrollView(
                    child: Column(
                      children: [
                        CoverPhotoWidget(
                          imageUrl: coverImageUrl,
                          onChangeCover: () {
                            print('Nhấn đổi ảnh bìa');
                          },
                          child: EditAvatarButton(
                            imageUrl: avatarImageUrl,
                            size: 160,
                            onPressed: () {
                              print('Nhấn đổi avatar');
                            },
                          ),
                        ),
                        const SizedBox(height: 80),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Column(
                            children: [
                              Center(
                                child: Text(
                                  state.userEntity.userName,
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineSmall
                                      ?.copyWith(fontWeight: FontWeight.w700),
                                ),
                              ),
                              const SizedBox(height: 16),
                              PrimaryButton(
                                onPressed: () => navigateToEditProfile(context),
                                title: "Edit Profile",
                                icon: Icon(
                                  Icons.edit,
                                  color: AppColors.primaryWhite,
                                ),
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
          ),
        ),
      ),
    );
  }
}
