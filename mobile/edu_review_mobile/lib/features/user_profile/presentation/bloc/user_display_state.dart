import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

abstract class UserDisplayState {}

class UserLoading extends UserDisplayState {}

class UserLoaded extends UserDisplayState {
  final ProfileEntity profileEntity;

  UserLoaded({required this.profileEntity});
}

class LoadUserFailure extends UserDisplayState {
  final String errorMessage;

  LoadUserFailure({required this.errorMessage});
}
