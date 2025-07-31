import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/auth/data/models/auth_tokens.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';

abstract class AuthRepository {
  Future<Either<Failure, AuthTokenModel>> signUp(SignUpParams signupParams);
  Future<Either<Failure, AuthTokenModel>> signIn(SignInParams signinParams);
  Future<bool> isLoggedIn();
}