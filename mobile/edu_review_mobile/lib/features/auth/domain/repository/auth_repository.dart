import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';

abstract class AuthRepository {
  Future<Either> signUp(SignUpParams signupParams);
  Future<Either> signIn(SignInParams signinParams);
  Future<bool> isLoggedIn();
}