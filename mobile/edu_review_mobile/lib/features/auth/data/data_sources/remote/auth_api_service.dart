import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/auth/data/models/auth_tokens.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/service_locator.dart';

abstract class AuthApiService {
  Future<Either<Failure, AuthTokenModel>> signUp(SignUpParams signupParams);
  Future<Either<Failure, AuthTokenModel>> signIn(SignInParams signinParams);
  Future<AuthTokenModel> refreshToken(String refreshToken);
}

class AuthApiServiceImpl extends AuthApiService {

  @override
  Future<Either<Failure, AuthTokenModel>> signUp(SignUpParams signupParams) async {
    try {
      final response = await sl<DioClient>().post(
        ApiUrls.register,
        data: signupParams.toMap(),
      );

      final authToken = AuthTokenModel.fromJson(response.data);
      return Right(authToken);
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
  Future<Either<Failure, AuthTokenModel>> signIn(SignInParams signinParams) async {
    try {
      final response = await sl<DioClient>().post(
        ApiUrls.login,
        data: signinParams.toMap(),
      );

      final authToken = AuthTokenModel.fromJson(response.data);
      return Right(authToken);
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
  Future<AuthTokenModel> refreshToken(String refreshToken) async {
    final response = await sl<DioClient>().post(
      ApiUrls.refreshToken,
      data: {'refreshToken': refreshToken},
    );

    return AuthTokenModel.fromJson(response.data);
  }
}
