import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/local/auth_local_service.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/remote/auth_api_service.dart';
import 'package:edu_review_mobile/features/auth/data/models/auth_tokens.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class AuthRepositoryImpl extends AuthRepository {
  final _apiService = sl<AuthApiService>();
  final _localService = sl<AuthLocalService>();

  @override
  Future<Either<Failure, AuthTokenModel>> signUp(SignUpParams signupParams) async {
    final result = await _apiService.signUp(signupParams);
    return await result.fold<Future<Either<Failure, AuthTokenModel>>>(
      (error) async => Left(error),
      (authToken) async {
        await _localService.saveTokens(authToken.accessToken, authToken.refreshToken);
        return Right(authToken);
      },
    );
  }

  @override
  Future<Either<Failure, AuthTokenModel>> signIn(SignInParams signinParams) async {
    final result = await _apiService.signIn(signinParams);
    return await result.fold<Future<Either<Failure, AuthTokenModel>>>(
      (error) async => Left(error),
      (authToken) async {
        await _localService.saveTokens(authToken.accessToken, authToken.refreshToken);
        return Right(authToken);
      },
    );
  }

  @override
  Future<bool> isLoggedIn() async {
    return await _localService.isLoggedIn();
  }
}
