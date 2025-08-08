import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class EditProfileUseCase
    implements UseCase<Either<Failure, ProfileEntity>, EditProfileModel> {
  @override
  Future<Either<Failure, ProfileEntity>> call(EditProfileModel editModel) async {
    try {
      final result = await sl<ProfileRepository>().editProfile(editModel);
      return result.fold(
        (failure) => Left(failure),
        (profile) => Right(profile),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
