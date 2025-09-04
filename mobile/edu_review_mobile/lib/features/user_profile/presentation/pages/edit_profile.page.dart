// ignore_for_file: deprecated_member_use

import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common/widgets/loading/custom_loading_indicator.dart';
import 'package:edu_review_mobile/common/widgets/picker/avatar_picker.dart';
import 'package:edu_review_mobile/common/widgets/picker/cover_image_picker.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/services/image_uploader_service.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/edit_profile_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/edit_profile_state.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http_parser/http_parser.dart';
import 'package:path/path.dart' as path;

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

  String? _avatarURL;
  String? _coverURL;
  bool _isUploadingAvatar = false;
  bool _isUploadingCover = false;

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

      _avatarURL = profile.avatarUrl;
      _coverURL = profile.coverImageUrl;

      _isInitialized = true;
    }
  }

  Future<void> _uploadProfileImage(bool isAvatar) async {
    final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (pickedFile == null) return;

    setState(() {
      if (isAvatar) {
        _isUploadingAvatar = true;
      } else {
        _isUploadingCover = true;
      }
    });

    try {
      final ext = path.extension(pickedFile.path).toLowerCase();
      final mimeType = ext == '.png' ? MediaType('image', 'png') : MediaType('image', 'jpeg');
      final formData = FormData.fromMap({
        'image': await MultipartFile.fromFile(
          pickedFile.path,
          filename: path.basename(pickedFile.path),
          contentType: mimeType,
        ),
      });

      final result = await sl<UploadImageApiService>().uploadImage(formData);
      result.fold(
        (failure) => _showSnackBar(failure.message),
        (success) {
          setState(() {
            if (isAvatar) {
              _avatarURL = success.secureUrl;
            } else {
              _coverURL = success.secureUrl;
            }
          });
          _showSnackBar('Cập nhật ảnh thành công!');
        },
      );
    } catch (e) {
      _showSnackBar('Error: $e');
    } finally {
      setState(() {
        if (isAvatar) {
          _isUploadingAvatar = false;
        } else {
          _isUploadingCover = false;
        }
      });
    }
  }

  void _deleteProfileImage(bool isAvatar) {
    setState(() {
      if (isAvatar) {
        _avatarURL = null;
      } else {
        _coverURL = null;
      }
    });
    _showSnackBar('Xóa ảnh thành công!');
  }

  void _saveProfile(EditProfileCubit cubit, ProfileEntity currentProfile) {
    final editModel = EditProfileModel(
      firstName: currentProfile.firstName,
      lastName: currentProfile.lastName,
      displayName: _displayNameController.text.trim(),
      bio: _bioController.text.trim(),
      avatarUrl: _avatarURL ?? currentProfile.avatarUrl,
      coverImageUrl: _coverURL ?? currentProfile.coverImageUrl,
      dateOfBirth: currentProfile.dateOfBirth,
      gender: currentProfile.gender,
      country: currentProfile.country,
      city: _cityController.text.trim(),
      address: currentProfile.address,
      timezone: currentProfile.timezone,
      language: currentProfile.language,
      universityName: _universityController.text.trim(),
      major: _majorController.text.trim(),
      graduationYear: currentProfile.graduationYear,
      studentId: currentProfile.studentId,
      isStudentVerified: currentProfile.isStudentVerified,
      privacySettings: currentProfile.privacySettings,
      notificationSettings: currentProfile.notificationSettings,
    );

    cubit.saveProfile(editModel);
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => EditProfileCubit()..loadProfile(),
      child: BlocListener<EditProfileCubit, EditProfileState>(
        listener: (context, state) {
          if (state is EditProfileSuccess) {
            _showSnackBar('Cập nhật hồ sơ thành công!');
            Navigator.of(context).pop();
          }
          if (state is EditProfileFailure) {
            _showSnackBar('Lỗi: ${state.errorMessage}');
          }
        },
        child: Scaffold(
          appBar: CustomAppBar(
            title: 'Chỉnh sửa hồ sơ',
            onBackPressed: () => Navigator.of(context).maybePop(),
          ),
          body: GestureDetector(
            behavior: HitTestBehavior.translucent,
            onTap: () => FocusScope.of(context).unfocus(),
            child: BlocBuilder<EditProfileCubit, EditProfileState>(
              builder: (context, state) {
                if (state is EditProfileLoading) {
                  return const Center(child: CustomLoadingIndicator());
                }

                if (state is EditProfileLoaded) {
                  _initializeControllers(state.profileEntity);

                  return SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Avatar
                        const SizedBox(height: 16),
                        Text(
                          'Ảnh đại diện',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                fontFamily: 'Roboto-Bold',
                                color: AppColors.textBlack,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Center(
                          child: AvatarImagePicker(
                            imageUrl: _avatarURL ?? AppDefaultImages.defaultAvatar,
                            isUploading: _isUploadingAvatar,
                            onTap: () => _uploadProfileImage(true),
                            onDelete: () => _deleteProfileImage(true),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Cover
                        Text(
                          'Ảnh bìa',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                fontFamily: 'Roboto-Bold',
                                color: AppColors.textBlack,
                              ),
                        ),
                        const SizedBox(height: 8),
                        CoverImagePicker(
                          imageUrl: _coverURL ?? AppDefaultImages.defaultCover,
                          isUploading: _isUploadingCover,
                          onTap: () => _uploadProfileImage(false),
                          onDelete: () => _deleteProfileImage(false),
                        ),
                        const SizedBox(height: 24),

                        // Form fields
                        CustomTextField(
                          label: 'Tên hiển thị',
                          controller: _displayNameController,
                          placeholder: 'Nhập tên hiển thị',
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          label: 'Giới thiệu',
                          controller: _bioController,
                          placeholder: 'Nhập thông tin giới thiệu',
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          label: 'Thành phố',
                          controller: _cityController,
                          placeholder: 'Nhập tên thành phố',
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          label: 'Trường đại học',
                          controller: _universityController,
                          placeholder: 'Nhập tên trường đại học',
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          label: 'Chuyên ngành',
                          controller: _majorController,
                          placeholder: 'Nhập chuyên ngành',
                        ),
                        const SizedBox(height: 32),

                        // Save button
                        BlocBuilder<EditProfileCubit, EditProfileState>(
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
                                        valueColor:
                                            AlwaysStoppedAnimation<Color>(Colors.white),
                                      ),
                                    )
                                  : const Text(
                                      'Lưu thay đổi',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                            );
                          },
                        ),
                        const SizedBox(height: 32),
                      ],
                    ),
                  );
                }

                if (state is EditProfileFailure) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline, size: 64, color: Colors.red),
                        const SizedBox(height: 16),
                        Text(
                          'Lỗi: ${state.errorMessage}',
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () => context.read<EditProfileCubit>().loadProfile(),
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
