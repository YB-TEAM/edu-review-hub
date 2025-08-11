import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/profile.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class ProfileApiService {
  Future<Either<Failure, ProfileEntity>> getUser();
  Future<Either<Failure, ProfileEntity>> editProfile(EditProfileModel profileData);
  Future<Either<Failure, List<BlogResponse>>> getBlogs();
  Future<Either<Failure, void>> deleteBlog(int blogId);
}

class ProfileApiServiceImpl extends ProfileApiService {
  @override
  Future<Either<Failure, ProfileEntity>> getUser() async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');
      var response = await sl<DioClient>().get(
        ApiUrls.userProfile,
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      var profileModel = ProfileModel.fromMap(response.data);
      return Right(profileModel.toEntity());
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.response?.data['message'] ?? 'Some errors occur when fetching user profile', statusCode: e.response?.statusCode));
    }
  }

  @override
  Future<Either<Failure, List<BlogResponse>>> getBlogs() async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');
      var response = await sl<DioClient>().get(
        ApiUrls.getMyBlog,
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      final data = response.data['data'] as List<dynamic>;
      List<BlogResponse> blogs = data
        .map((item) => BlogResponse.fromJson(item as Map<String, dynamic>))
        .toList();
      return Right(blogs);
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.response?.data['message'] ?? 'Some errors occur when fetching user profile', statusCode: e.response?.statusCode));
    }
  }

  @override
  Future<Either<Failure, void>> deleteBlog(int blogId) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');

      await sl<DioClient>().delete(
        ApiUrls.blog(blogId),
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      return const Right(null); 
    } on DioException catch (e) {
      return Left(ServerFailure(
        message: e.response?.data['message'] ?? 'Failed to delete blog',
        statusCode: e.response?.statusCode,
      ));
    }
  }

  @override
  Future<Either<Failure, ProfileEntity>> editProfile(EditProfileModel profileData) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');
      var response = await sl<DioClient>().patch(
        ApiUrls.userProfile,
        data: profileData.toMap(),
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        ),
      );
      var profileModel = ProfileModel.fromMap(response.data);
      return Right(profileModel.toEntity());
    } on DioException catch (e) {
      return Left(ServerFailure(message: e.response?.data['message'] ?? 'Some errors occur when fetching user profile', statusCode: e.response?.statusCode)
      );
    }
  }
}
