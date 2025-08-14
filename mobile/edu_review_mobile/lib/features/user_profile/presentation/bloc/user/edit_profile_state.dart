import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

abstract class EditProfileState {}

class EditProfileInitial extends EditProfileState {}

class EditProfileLoading extends EditProfileState {}

class EditProfileLoaded extends EditProfileState {
  final ProfileEntity profileEntity;

  EditProfileLoaded({required this.profileEntity});
}

class EditProfileSaving extends EditProfileState {}

class EditProfileSuccess extends EditProfileState {
  final ProfileEntity profileEntity;

  EditProfileSuccess({required this.profileEntity});
}

class EditProfileFailure extends EditProfileState {
  final String errorMessage;

  EditProfileFailure({required this.errorMessage});
}
