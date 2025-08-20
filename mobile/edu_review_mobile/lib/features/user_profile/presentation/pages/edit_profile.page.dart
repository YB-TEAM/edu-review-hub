// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common/widgets/loading/custom_loading_indicator.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/edit_profile_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/edit_profile_state.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/image_picker.widget.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _universityController = TextEditingController();
  final TextEditingController _majorController = TextEditingController();
  final TextEditingController _bioController = TextEditingController();
  final TextEditingController _displayNameController = TextEditingController();
  bool _isInitialized = false;

  @override
  void dispose() {
    _cityController.dispose();
    _universityController.dispose();
    _majorController.dispose();
    _bioController.dispose();
    _displayNameController.dispose();
    super.dispose();
  }

  void _initializeControllers(ProfileEntity profile) {
    if (!_isInitialized) {
      _cityController.text = profile.city ?? '';
      _universityController.text = profile.universityName ?? '';
      _majorController.text = profile.major ?? '';
      _bioController.text = profile.bio ?? '';
      _displayNameController.text = profile.displayName ?? '';
      _isInitialized = true;
    }
  }

  void _onAvatarPressed() async {
    final result = await ImagePickerWidget.showImageSourceDialog(context);
    if (result != null) {
      ImagePickerWidget.showImagePickerNotImplemented(context);
    }
  }

  void _onCoverPressed() async {
    final result = await ImagePickerWidget.showImageSourceDialog(context);
    if (result != null) {
      ImagePickerWidget.showImagePickerNotImplemented(context);
    }
  }

  void _saveProfile(EditProfileCubit cubit, ProfileEntity currentProfile) {
    final editModel = EditProfileModel(
      // Thông tin cơ bản
      firstName: currentProfile.firstName,
      lastName: currentProfile.lastName,
      displayName: _displayNameController.text.trim(),
      bio: _bioController.text.trim(),
      
      // Hình ảnh
      avatarUrl: currentProfile.avatarUrl,
      coverImageUrl: currentProfile.coverImageUrl,
      
      // Thông tin cá nhân
      dateOfBirth: currentProfile.dateOfBirth,
      gender: currentProfile.gender,
      
      // Địa chỉ
      country: currentProfile.country,
      city: _cityController.text.trim(),
      address: currentProfile.address,
      
      // Cài đặt cá nhân
      timezone: currentProfile.timezone,
      language: currentProfile.language,
      
      // Thông tin học tập
      universityName: _universityController.text.trim(),
      major: _majorController.text.trim(),
      graduationYear: currentProfile.graduationYear,
      studentId: currentProfile.studentId,
      isStudentVerified: currentProfile.isStudentVerified,
      
      // Cài đặt hệ thống
      privacySettings: currentProfile.privacySettings,
      notificationSettings: currentProfile.notificationSettings,
    );

    cubit.saveProfile(editModel);
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => EditProfileCubit()..loadProfile(),
      child: BlocListener<EditProfileCubit, EditProfileState>(
        listener: (context, state) {
          if (state is EditProfileSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Cập nhật hồ sơ thành công!'),
                backgroundColor: Colors.green,
              ),
            );
            Navigator.of(context).pop();
          }
          if (state is EditProfileFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Lỗi: ${state.errorMessage}'),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
        child: Scaffold(
          appBar: CustomAppBar(
            title: 'Chỉnh sửa hồ sơ',
            onBackPressed: () => Navigator.of(context).maybePop(),
          ),
          bottomNavigationBar: null,
          body: GestureDetector(
            behavior: HitTestBehavior.translucent,
            onTap: () {
              FocusScope.of(context).unfocus();
            },
            child: BlocBuilder<EditProfileCubit, EditProfileState>(
              builder: (context, state) {
                if (state is EditProfileLoading) {
                  return const Center(child: CustomLoadingIndicator());
                }

                if (state is EditProfileLoaded) {
                  _initializeControllers(state.profileEntity);

                  return SingleChildScrollView(
                    child: Column(
                      children: [
                        const SizedBox(height: 32),
                        // Form chỉnh sửa
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Ảnh đại diện',
                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Center(
                                child: Container(
                                  width: 120,
                                  height: 120,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: Colors.grey.shade300,
                                      width: 2,
                                    ),
                                  ),
                                  child: Stack(
                                    children: [
                                      ClipOval(
                                        child: Image.network(
                                          state.profileEntity.avatarUrl?.isNotEmpty == true
                                              ? state.profileEntity.avatarUrl!
                                              : AppDefaultImages.defaultAvatar,
                                          width: 120,
                                          height: 120,
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                      Positioned(
                                        bottom: 0,
                                        right: -8,
                                        child: ElevatedButton(
                                          style: ElevatedButton.styleFrom(
                                            shape: const CircleBorder(),
                                            padding: const EdgeInsets.all(8),
                                            backgroundColor: Colors.white,
                                            elevation: 2,
                                          ),
                                          onPressed: _onAvatarPressed,
                                          child: SvgPicture.asset(
                                            AppIcons.camera,
                                            width: 20,
                                            height: 20,
                                            color: Colors.black,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),

                              // Ảnh bìa
                              Text(
                                'Ảnh bìa',
                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Container(
                                width: double.infinity,
                                height: 120,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: Colors.grey.shade300,
                                  ),
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Stack(
                                    children: [
                                      Image.network(
                                        state.profileEntity.coverImageUrl?.isNotEmpty == true
                                            ? state.profileEntity.coverImageUrl!
                                            : AppDefaultImages.defaultCover,
                                        width: double.infinity,
                                        height: 120,
                                        fit: BoxFit.cover,
                                      ),
                                      Positioned(
                                        top: 8,
                                        right: 8,
                                        child: ElevatedButton(
                                          style: ElevatedButton.styleFrom(
                                            shape: const CircleBorder(),
                                            padding: const EdgeInsets.all(8),
                                            backgroundColor: Colors.white,
                                            elevation: 2,
                                          ),
                                          onPressed: _onCoverPressed,
                                          child: SvgPicture.asset(
                                            AppIcons.camera,
                                            width: 20,
                                            height: 20,
                                            color: Colors.black,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 24),

                              // Tên hiển thị
                              Text(
                                'Tên hiển thị',
                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _displayNameController,
                                placeholder: 'Nhập tên hiển thị',
                              ),
                              const SizedBox(height: 16),

                              // Giới thiệu
                              Text(
                                'Giới thiệu',
                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _bioController,
                                placeholder: 'Nhập thông tin giới thiệu',
                              ),
                              const SizedBox(height: 16),

                              // Thành phố
                              Text(
                                'Thành phố',
                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _cityController,
                                placeholder: 'Nhập tên thành phố',
                              ),
                              const SizedBox(height: 16),

                              // Trường đại học
                              Text(
                                'Trường đại học',
                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _universityController,
                                placeholder: 'Nhập tên trường đại học',
                              ),
                              const SizedBox(height: 16),

                              // Chuyên ngành
                              Text(
                                'Chuyên ngành',
                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _majorController,
                                placeholder: 'Nhập chuyên ngành',
                              ),
                              const SizedBox(height: 32),

                              // Nút lưu
                              SizedBox(
                                width: double.infinity,
                                child: BlocBuilder<EditProfileCubit, EditProfileState>(
                                  builder: (context, saveState) {
                                    final isLoading = saveState is EditProfileSaving;
                                    return ElevatedButton(
                                      onPressed: isLoading
                                          ? null
                                          : () => _saveProfile(
                                                context.read<EditProfileCubit>(),
                                                state.profileEntity,
                                              ),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppColors.primaryBlue,
                                        minimumSize: const Size(double.infinity, 48),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                      ),
                                      child: isLoading
                                          ? const SizedBox(
                                              width: 20,
                                              height: 20,
                                              child: CircularProgressIndicator(
                                                strokeWidth: 2,
                                                valueColor: AlwaysStoppedAnimation<Color>(
                                                  Colors.white,
                                                ),
                                              ),
                                            )
                                          : Row(
                                              mainAxisSize: MainAxisSize.min,
                                              mainAxisAlignment: MainAxisAlignment.center,
                                              children: [
                                                const Icon(
                                                  Icons.save,
                                                  color: AppColors.primaryWhite,
                                                ),
                                                const SizedBox(width: 8),
                                                Text(
                                                  'Lưu thay đổi',
                                                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                                        color: AppColors.primaryWhite,
                                                        fontWeight: FontWeight.w600,
                                                      ),
                                                ),
                                              ],
                                            ),
                                    );
                                  },
                                ),
                              ),
                              const SizedBox(height: 32),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }

                if (state is EditProfileFailure) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Colors.red,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Lỗi: ${state.errorMessage}',
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            context.read<EditProfileCubit>().loadProfile();
                          },
                          child: const Text('Thử lại'),
                        ),
                      ],
                    ),
                  );
                }

                return const Center(child: CustomLoadingIndicator());
              },
            ),
          ),
        ),
      ),
    );
  }
}
