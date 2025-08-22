import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

abstract class UserState {}

class UserInitial extends UserState {}

class UserLoading extends UserState {}

class UserLoaded extends UserState {
  final ProfileEntity profile;
  UserLoaded(this.profile);
}

class UserError extends UserState {
  final String message;
  UserError(this.message);
}
