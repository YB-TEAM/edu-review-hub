import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

abstract class UserDisplayState {}

class UserLoading extends UserDisplayState {}

class UserLoaded extends UserDisplayState {
  final ProfileEntity profileEntity;
  final List<BlogResponse> blogs;

  UserLoaded({required this.profileEntity, required this.blogs});
}

class LoadUserFailure extends UserDisplayState {
  final String errorMessage;

  LoadUserFailure({required this.errorMessage});
}
