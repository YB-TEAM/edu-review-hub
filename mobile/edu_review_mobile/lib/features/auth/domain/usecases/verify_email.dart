import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/auth/data/models/verify_email_params.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class VerifyEmailUseCase implements UseCase<void, VerifyEmailParams> {
  @override
  Future<Either<Failure, void>> call(VerifyEmailParams ? params) async{
    if (params == null) {
      return Left(ServerFailure(message: "VerifyEmailParams is null"));
    }
    return await sl<AuthRepository>().verifyEmail(params);
  }
}