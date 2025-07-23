import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/auth/data/models/auth_tokens.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/service_locator.dart';

abstract class AuthApiService {
  Future<Either> signUp(SignUpParams signupParams);
  Future<Either> signIn(SignInParams signinParams);
  Future<AuthTokenModel> refreshToken(String refreshToken);
}

class AuthApiServiceImpl extends AuthApiService {

  @override
  Future<Either> signUp(SignUpParams signupParams) async {
    try {
      var response = await sl<DioClient>().post(
        ApiUrls.register,
        data: signupParams.toMap()
      );

      return Right(response);
    } on DioException catch(e) {
      return Left(e.response!.data['message']);
    }
  }
  
  @override
  Future<Either> signIn(signinParams) async {
    try {
      var response = await sl<DioClient>().post(
        ApiUrls.login,
        data: signinParams.toMap()
      );

      return Right(response);
    } on DioException catch(e) {
      return Left(e.response!.data['message']);
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