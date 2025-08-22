import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_list_response.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_pagination.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';

abstract class BlogRepository {
  Future<Either<Failure, BlogResponse>> createBlog(BlogParams blogParams);
  Future<Either<Failure, BlogResponse>> publishBlog(int blogId);
  Future<Either<Failure, BlogListResponse>> getBlogs(BlogPagination paginations);
  Future<Either<Failure, void>> reactionBlog(int blogId);
}