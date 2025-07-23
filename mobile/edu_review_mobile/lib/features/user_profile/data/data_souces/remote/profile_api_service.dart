import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class ProfileApiService {
  Future<Either> getUser();
  Future<Either> editProfile(Map<String, dynamic> profileData);
}

class ProfileApiServiceImpl extends ProfileApiService {
  @override
  Future<Either> getUser() async {
    try {
      SharedPreferences sharedPreferences =
          await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');
      var response = await sl<DioClient>().get(
        ApiUrls.userProfile,
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      return Right(response);
    } on DioException catch (e) {
      return Left(e.response!.data['message']);
    }
  }

  @override
  Future<Either> editProfile(Map<String, dynamic> profileData) async {
    try {
      SharedPreferences sharedPreferences =
          await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');
      var response = await sl<DioClient>().patch(
        ApiUrls.userProfile,
        data: profileData,
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        ),
      );
      return Right(response);
    } on DioException catch (e) {
      return Left(
        e.response?.data['message'] ?? 'Some errors occur when edit profile',
      );
    }
  }
}
