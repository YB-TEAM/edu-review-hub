import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/local/auth_local_service.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/remote/auth_api_service.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class AuthRepositoryImpl extends AuthRepository {
  final _apiService = sl<AuthApiService>();
  final _localService = sl<AuthLocalService>();

  @override
  Future<Either> signUp(SignUpParams signupParams) async {
    final result = await _apiService.signUp(signupParams);
    return result.fold(
      (error) => Left(error),
      (data) async {
        final response = data;
        final accessToken = response.data['accessToken'];
        final refreshToken = response.data['refreshToken'];
        await _localService.saveTokens(accessToken, refreshToken);
        return Right(response);
      },
    );
  }

  @override
  Future<Either> signIn(SignInParams signinParams) async {
    final result = await _apiService.signIn(signinParams);
    return result.fold(
      (error) => Left(error),
      (data) async {
        final response = data;
        final accessToken = response.data['accessToken'];
        final refreshToken = response.data['refreshToken'];
        await _localService.saveTokens(accessToken, refreshToken);
        return Right(response);
      },
    );
  }

  @override
  Future<bool> isLoggedIn() async {
    return await _localService.isLoggedIn();
  }
}
