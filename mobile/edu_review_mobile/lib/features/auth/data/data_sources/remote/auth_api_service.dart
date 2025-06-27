import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class AuthApiService {
  Future<Either> signUp(SignUpParams signupParams);
  Future<Either> getUser();
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
  Future<Either> getUser() async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('token');
      var response = await sl<DioClient>().get(
        ApiUrls.userProfile,
        options: Options(
          headers: {
            'Authorization' : 'Bearer $token'
          } 
        )
      );
      return Right(response);
    } on DioException catch(e) {
      return Left(e.response!.data['message']);
    }
  }


}