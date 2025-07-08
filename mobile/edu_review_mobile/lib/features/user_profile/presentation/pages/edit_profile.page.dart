import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common/widgets/loading/custom_loading_indicator.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/edit_profile_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/edit_profile_state.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/widgets/image_picker.widget.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

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
    _cityController.text = profile.city ?? '';
    _universityController.text = profile.universityName ?? '';
    _majorController.text = profile.major ?? '';
    _bioController.text = profile.bio ?? '';
    _displayNameController.text = profile.displayName ?? '';
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
    final profileData = {
      'city': _cityController.text.trim(),
      'universityName': _universityController.text.trim(),
      'major': _majorController.text.trim(),
      'bio': _bioController.text.trim(),
      'displayName': _displayNameController.text.trim(),
      // Keep other values unchanged
      'avatarUrl': currentProfile.avatarUrl,
      'coverImageUrl': currentProfile.coverImageUrl,
    };

    cubit.saveProfile(profileData);
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
                content: Text('Profile updated successfully!'),
                backgroundColor: Colors.green,
              ),
            );
            Navigator.of(context).pop();
          }
          if (state is EditProfileFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Error: ${state.errorMessage}'),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
        child: Scaffold(
          appBar: CustomAppBar(
            title: 'Edit Profile',
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

                        // Edit Form
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Avatar Image
                              const Text(
                                'Avatar',
                                style: TextStyle(
                                  fontSize: 16,
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
                                          state
                                                      .profileEntity
                                                      .avatarUrl
                                                      ?.isNotEmpty ==
                                                  true
                                              ? state.profileEntity.avatarUrl!
                                              : 'https://via.placeholder.com/120x120/cccccc/666666?text=Avatar',
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
                                          child: const Icon(
                                            Icons.camera_alt,
                                            size: 20,
                                            color: Colors.black,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),

                              // Cover Image
                              const Text(
                                'Cover Image',
                                style: TextStyle(
                                  fontSize: 16,
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
                                        state
                                                    .profileEntity
                                                    .coverImageUrl
                                                    ?.isNotEmpty ==
                                                true
                                            ? state.profileEntity.coverImageUrl!
                                            : 'https://via.placeholder.com/400x120/cccccc/666666?text=Cover+Image',
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
                                          child: const Icon(
                                            Icons.image,
                                            size: 20,
                                            color: Colors.black,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 24),

                              // Display Name
                              const Text(
                                'Display Name',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _displayNameController,
                                placeholder: 'Enter display name',
                              ),
                              const SizedBox(height: 16),

                              // Bio
                              const Text(
                                'Bio',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _bioController,
                                placeholder: 'Enter your bio',
                              ),
                              const SizedBox(height: 16),

                              // City
                              const Text(
                                'City',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _cityController,
                                placeholder: 'Enter city',
                              ),
                              const SizedBox(height: 16),

                              // University
                              const Text(
                                'University',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _universityController,
                                placeholder: 'Enter university name',
                              ),
                              const SizedBox(height: 16),

                              // Major
                              const Text(
                                'Major',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              CustomTextField(
                                controller: _majorController,
                                placeholder: 'Enter major',
                              ),
                              const SizedBox(height: 32),

                              // Save Button
                              SizedBox(
                                width: double.infinity,
                                child: BlocBuilder<
                                  EditProfileCubit,
                                  EditProfileState
                                >(
                                  builder: (context, saveState) {
                                    final isLoading =
                                        saveState is EditProfileSaving;
                                    return ElevatedButton(
                                      onPressed:
                                          isLoading
                                              ? null
                                              : () => _saveProfile(
                                                context
                                                    .read<EditProfileCubit>(),
                                                state.profileEntity,
                                              ),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppColors.primaryBlue,
                                        minimumSize: const Size(
                                          double.infinity,
                                          48,
                                        ),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            8,
                                          ),
                                        ),
                                      ),
                                      child:
                                          isLoading
                                              ? const SizedBox(
                                                width: 20,
                                                height: 20,
                                                child: CircularProgressIndicator(
                                                  strokeWidth: 2,
                                                  valueColor:
                                                      AlwaysStoppedAnimation<
                                                        Color
                                                      >(Colors.white),
                                                ),
                                              )
                                              : Row(
                                                mainAxisSize: MainAxisSize.min,
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  const Icon(
                                                    Icons.save,
                                                    color:
                                                        AppColors.primaryWhite,
                                                  ),
                                                  const SizedBox(width: 8),
                                                  Text(
                                                    'Save Changes',
                                                    style: Theme.of(context)
                                                        .textTheme
                                                        .bodyLarge
                                                        ?.copyWith(
                                                          color:
                                                              AppColors
                                                                  .primaryWhite,
                                                          fontWeight:
                                                              FontWeight.w600,
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
                          'Error: ${state.errorMessage}',
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            context.read<EditProfileCubit>().loadProfile();
                          },
                          child: const Text('Try Again'),
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
