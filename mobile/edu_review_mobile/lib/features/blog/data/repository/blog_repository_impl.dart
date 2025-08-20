import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/blog/data/data_sources/remote/blog_api_service.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_list_response.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_pagination.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/blog/domain/repository/blog_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class BlogRepositoryImpl extends BlogRepository {
  final _apiService = sl<BlogApiService>();

  @override
  Future<Either<Failure, BlogResponse>> createBlog(BlogParams blogParams) async {
    try {
      return await _apiService.createBlog(blogParams);
    } on DioException catch (e) {
      return Left(
        ServerFailure(
          message: e.response?.data['message'] ?? 'Failed to create blog',
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
      return await _apiService.publishBlog(blogId);
    } on DioException catch (e) {
      return Left(
        ServerFailure(
          message: e.response?.data['message'] ?? 'Failed to publish blog',
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
      return await _apiService.getBlogs(paginations);
    } on DioException catch (e) {
      return Left(
        ServerFailure(
          message: e.response?.data['message'] ?? 'Failed to get blogs',
          statusCode: e.response?.statusCode,
        ),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
