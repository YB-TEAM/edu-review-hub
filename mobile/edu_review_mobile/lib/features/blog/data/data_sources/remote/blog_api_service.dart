import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class BlogApiService {
  Future<Either<Failure, BlogResponse>> createBlog(BlogParams blogParams);
  Future<Either<Failure, BlogResponse>> publishBlog(int blogId);
}

class BlogApiServiceImpl extends BlogApiService {
  @override
  Future<Either<Failure, BlogResponse>> createBlog(BlogParams blogParams) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');

      final response = await sl<DioClient>().post(
        ApiUrls.createBlog,
        data: blogParams.toJson(),
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        ),
      );
      final blogResponse = BlogResponse.fromJson(response.data);
      return Right(blogResponse);
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
  Future<Either<Failure, BlogResponse>> publishBlog(int blogId) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');

      final response = await sl<DioClient>().post(
        ApiUrls.publishBlog(blogId), 
        data: {
          "id": blogId,
        },
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        ),
      );
      final blogResponse = BlogResponse.fromJson(response.data);
      return Right(blogResponse);
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
}
