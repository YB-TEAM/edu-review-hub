import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/auth/data/models/user.dart';
import 'package:edu_review_mobile/service_locator.dart';

abstract class AuthApiService {
  Future<Either> signUp(UserModel user);
}

class AuthApiServiceImpl extends AuthApiService {

  @override
  Future<Either> signUp(UserModel user) async {
    try {
      var response = await sl<DioClient>().post(
        ApiUrls.register,
        data: user.toMap()
      );

      return Right(response);
    } on DioException catch(e) {
      return Left(e.response!.data['message']);
    }
  }
}