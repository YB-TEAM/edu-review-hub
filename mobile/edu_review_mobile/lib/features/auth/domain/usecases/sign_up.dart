import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/auth/data/models/auth_tokens.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class SignUpUseCase implements UseCase<Either, SignUpParams> {
  @override
  Future<Either<Failure, AuthTokenModel>> call(SignUpParams ? param) async{
    if (param == null) {
      return Left(ServerFailure(message: "SignUpParams is null"));
    }
    return sl<AuthRepository>().signUp(param);
  }

}