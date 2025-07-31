import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_response.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class SignUpUseCase implements UseCase<Either, SignUpParams> {
  @override
  Future<Either<Failure, SignUpResponse>> call(SignUpParams ? param) async{
    if (param == null) {
      return Left(ServerFailure(message: "SignUpParams is null"));
    }
    return await sl<AuthRepository>().signUp(param);
  }

}