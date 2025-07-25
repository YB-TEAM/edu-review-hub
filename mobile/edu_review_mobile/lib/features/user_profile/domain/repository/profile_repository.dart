import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

abstract class ProfileRepository {
  Future<Either> getUser();
  Future<Either<String, ProfileEntity>> editProfile(
    EditProfileModel editModel,
  );
}
