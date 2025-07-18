import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class GetUserUseCase implements UseCase<Either, dynamic> {
  @override
  Future<Either> call(dynamic param) async {
    return sl<ProfileRepository>().getUser();
  }
}
