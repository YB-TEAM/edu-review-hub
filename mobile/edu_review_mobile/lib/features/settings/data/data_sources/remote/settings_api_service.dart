import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class SettingsApiService {
  Future<Either<Failure, void>> logout(String deviceId);
}

class SettingsApiServiceImpl implements SettingsApiService {
  @override
  Future<Either<Failure, void>> logout(String deviceId) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');
      await sl<DioClient>().post(
        ApiUrls.logout,
        data: {'deviceId': deviceId},
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      return const Right(null);
    } on DioException catch (e) {
      return Left(ServerFailure(e.response?.data['message'] ?? 'Logout failed'));
    }
  }
}
