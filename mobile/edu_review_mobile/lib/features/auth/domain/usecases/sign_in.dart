import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/auth/data/models/auth_tokens.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class SignInUseCase implements UseCase<Either<Failure, AuthTokenModel>, SignInParams> {
  @override
  Future<Either<Failure, AuthTokenModel>> call(SignInParams? param) async {
    if (param == null) {
      return Left(ServerFailure(message: "SignInParams is null"));
    }
    return sl<AuthRepository>().signIn(param);
  }
}
