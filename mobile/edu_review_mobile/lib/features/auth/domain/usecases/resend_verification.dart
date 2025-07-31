import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class ResendVerificationUseCase implements UseCase<void, String> {
  @override
  Future<Either<Failure, void>> call(String ? email) async{
    if (email == null) {
      return Left(ServerFailure(message: "Email is null"));
    }
    return await sl<AuthRepository>().resendVerification(email);
  }
}