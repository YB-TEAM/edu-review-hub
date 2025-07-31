import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_response.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_response.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/verify_email_params.dart';

abstract class AuthRepository {
  Future<Either<Failure, SignUpResponse>> signUp(SignUpParams signupParams);
  Future<Either<Failure, SignInResponse>> signIn(SignInParams signinParams);
  Future<bool> isLoggedIn();
  Future<Either<Failure, void>> verifyEmail(VerifyEmailParams verifyEmailParams);
}