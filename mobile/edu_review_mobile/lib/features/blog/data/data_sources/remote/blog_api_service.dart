import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_list_response.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_pagination.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class BlogApiService {
  Future<Either<Failure, BlogResponse>> createBlog(BlogParams blogParams);
  Future<Either<Failure, BlogResponse>> publishBlog(int blogId);
  Future<Either<Failure, BlogListResponse>> getBlogs(BlogPagination paginations);
}

class BlogApiServiceImpl extends BlogApiService {
  @override
  Future<Either<Failure, BlogResponse>> createBlog(BlogParams blogParams) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');

      final response = await sl<DioClient>().post(
        ApiUrls.blogs,
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

  @override
  Future<Either<Failure, BlogListResponse>> getBlogs(BlogPagination paginations) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');

      final response = await sl<DioClient>().get(
        ApiUrls.blogs, 
        queryParameters: {
          'page': paginations.page,
          'limit': paginations.pageSize,
          if (paginations.authorId != null) 'authorId': paginations.authorId,
          if (paginations.tagIds != null && paginations.tagIds!.isNotEmpty) 'tagIds': paginations.tagIds,
          if (paginations.search != null && paginations.search!.isNotEmpty) 'search': paginations.search,
          if (paginations.sortBy != null && paginations.sortBy!.isNotEmpty) 'sortBy': paginations.sortBy,
          if (paginations.sortOrder != null && paginations.sortOrder!.isNotEmpty) 'sortOrder': paginations.sortOrder,
          if (paginations.dateFrom != null && paginations.dateFrom!.isNotEmpty) 'dateFrom': paginations.dateFrom,
          if (paginations.dateTo != null && paginations.dateTo!.isNotEmpty) 'dateTo': paginations.dateTo,
          if (paginations.minViews != null) 'minViews': paginations.minViews,
          if (paginations.minLikes != null) 'minLikes': paginations.minLikes,
          if (paginations.minComments != null) 'minComments': paginations.minComments,
        },
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
        ),
      );

      final blogPagination = BlogListResponse.fromJson(response.data);
      return Right(blogPagination);
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
