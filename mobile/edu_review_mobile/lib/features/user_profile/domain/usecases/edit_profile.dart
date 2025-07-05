import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class EditProfileUseCase
    implements UseCase<Either<String, ProfileEntity>, Map<String, dynamic>> {
  @override
  Future<Either<String, ProfileEntity>> call(Map<String, dynamic> param) async {
    try {
      return await sl<ProfileRepository>().editProfile(param);
    } catch (e) {
      return Left(e.toString());
    }
  }
}
