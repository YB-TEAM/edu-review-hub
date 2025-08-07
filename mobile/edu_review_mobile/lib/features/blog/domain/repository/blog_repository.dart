import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';

abstract class BlogRepository {
  Future<Either<Failure, BlogResponse>> createBlog(BlogParams blogParams);
}