import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/auth/data/models/reset_password_params.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class ResetPasswordUseCase implements UseCase<void, ResetPasswordParams> {
  @override
  Future<Either<Failure, void>> call(ResetPasswordParams params) async{
    return await sl<AuthRepository>().resetPassword(params);
  }
}