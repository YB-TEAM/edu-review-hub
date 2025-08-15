import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/auth/data/models/reset_password_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_response.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_response.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/verify_email_params.dart';
import 'package:edu_review_mobile/service_locator.dart';

abstract class AuthApiService {
  Future<Either<Failure, SignUpResponse>> signUp(SignUpParams signupParams);
  Future<Either<Failure, SignInResponse>> signIn(SignInParams signinParams);
  Future<SignInResponse> refreshToken(String refreshToken);
  Future<Either<Failure, void>> verifyEmail(VerifyEmailParams verifyEmailParams);
  Future<Either<Failure, void>> resendVerification(String email);
  Future<Either<Failure, void>> forgotPassword(String email);
  Future<Either<Failure, void>> resetPassword(ResetPasswordParams resetPasswordParams);
}

class AuthApiServiceImpl extends AuthApiService {

  @override
  Future<Either<Failure, SignUpResponse>> signUp(SignUpParams signupParams) async {
    try {
      final response = await sl<DioClient>().post(
        ApiUrls.register,
        data: signupParams.toMap(),
      );
      final signUpResponse = SignUpResponse.fromJson(response.data);
      return Right(signUpResponse);
    } on DioException catch (e) {
      return Left(
        ServerFailure(
          message: e.response?.data['message'] ?? 'Unknown error',
          statusCode: e.response?.statusCode,
        ),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, SignInResponse>> signIn(SignInParams signinParams) async {
    try {
      final response = await sl<DioClient>().post(
        ApiUrls.login,
        data: signinParams.toMap(),
      );

      final signInResponse = SignInResponse.fromJson(response.data);
      return Right(signInResponse);
    } on DioException catch (e) {
      return Left(
        ServerFailure(
          message: e.response?.data['message'] ?? 'Unknown error',
          statusCode: e.response?.statusCode,
        ),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<SignInResponse> refreshToken(String refreshToken) async {
    final response = await sl<DioClient>().post(
      ApiUrls.refreshToken,
      data: {'refreshToken': refreshToken},
    );

    return SignInResponse.fromJson(response.data);
  }

  @override
  Future<Either<Failure, void>> verifyEmail(VerifyEmailParams verifyEmailParams) async {
    try {
      await sl<DioClient>().post(
        ApiUrls.verifyEmail,
        data: verifyEmailParams.toMap(),
      );
      return Right(null); 
    } on DioException catch (e) {
      return Left(ServerFailure(
        message: e.response?.data['message'] ?? 'OTP verification failed',
        statusCode: e.response?.statusCode,
      ));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> resendVerification(String email) async {
    try {
      await sl<DioClient>().post(
        ApiUrls.resendVerification,
        data: {'email': email},
      );
      return Right(null); 
    } on DioException catch (e) {
      return Left(ServerFailure(
        message: e.response?.data['message'] ?? 'Resend verification failed',
        statusCode: e.response?.statusCode,
      ));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> forgotPassword(String email) async {
    try {
      await sl<DioClient>().post(
        ApiUrls.forgotPassword,
        data: {'email': email},
      );
      return Right(null); 
    } on DioException catch (e) {
      return Left(ServerFailure(
        message: e.response?.data['message'] ?? 'Send email failed',
        statusCode: e.response?.statusCode,
      ));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> resetPassword(ResetPasswordParams resetPasswordParams) async {
    try {
      await sl<DioClient>().post(
        ApiUrls.resetPassword,
        data: resetPasswordParams.toJson(),
      );
      return Right(null); 
    } on DioException catch (e) {
      return Left(ServerFailure(
        message: e.response?.data['message'] ?? 'Send email failed',
        statusCode: e.response?.statusCode,
      ));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
