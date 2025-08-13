import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/models/upload_image_response.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class UploadImageApiService {
  Future<Either<Failure, UploadImageResponse>> uploadImage(FormData data);
}

class UploadImageApiServiceImpl extends UploadImageApiService {
  @override
  Future<Either<Failure, UploadImageResponse>> uploadImage(FormData data) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');

      var response = await sl<DioClient>().post(
        ApiUrls.uploadImage,
        data: data,
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'multipart/form-data',
          },
        ),
      );

      var uploadImageResponse = UploadImageResponse.fromMap(response.data);
      return Right(uploadImageResponse);
    } on DioException catch (e) {
      return Left(
        ServerFailure(
          message: e.response?.data['message'] ?? 'Some errors occur when uploading image',
          statusCode: e.response?.statusCode,
        ),
      );
    }
  }
}
