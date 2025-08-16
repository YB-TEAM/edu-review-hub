import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/local/auth_local_service.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/remote/auth_api_service.dart';
import 'package:edu_review_mobile/features/auth/data/models/reset_password_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_response.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_response.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/verify_email_params.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class AuthRepositoryImpl extends AuthRepository {
  final _apiService = sl<AuthApiService>();
  final _localService = sl<AuthLocalService>();

  @override
  Future<Either<Failure, SignUpResponse>> signUp(SignUpParams signupParams) async {
    return await _apiService.signUp(signupParams);
  }

  @override
  Future<Either<Failure, SignInResponse>> signIn(SignInParams signinParams) async {
    final result = await _apiService.signIn(signinParams);
    return await result.fold<Future<Either<Failure, SignInResponse>>>(
      (error) async => Left(error),
      (signInResponse) async {
        await _localService.saveTokens(signInResponse.accessToken, signInResponse.refreshToken);
        return Right(signInResponse);
      },
    );
  }

  @override
  Future<bool> isLoggedIn() async {
    return await _localService.isLoggedIn();
  }

  @override
  Future<Either<Failure, void>> verifyEmail(VerifyEmailParams verifyEmailParams) async {
    try {
      final result = await _apiService.verifyEmail(verifyEmailParams);
      return result;
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.response?.data['message'] ?? 'Some errors occur when verifying email', statusCode: e.response?.statusCode));
    }
  }

  @override
  Future<Either<Failure, void>> resendVerification(String email) async {
    try {
      final result = await _apiService.resendVerification(email);
      return result;
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.response?.data['message'] ?? 'Some errors occur when resend verification', statusCode: e.response?.statusCode));
    }
  }
  

  @override
  Future<Either<Failure, void>> forgotPassword(String email) async {
    try {
      final result = await _apiService.forgotPassword(email);
      return result;
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.response?.data['message'] ?? 'Some errors occur when send request', statusCode: e.response?.statusCode));
    }
  }

  @override
  Future<Either<Failure, void>> resetPassword(ResetPasswordParams params) async {
    try {
      final result = await _apiService.resetPassword(params);
      return result;
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.response?.data['message'] ?? 'Some errors occur when reset password', statusCode: e.response?.statusCode));
    }
  }
}
