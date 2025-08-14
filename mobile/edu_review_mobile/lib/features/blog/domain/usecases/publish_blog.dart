import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/blog/domain/repository/blog_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class PublishBlogUseCase
    implements UseCase<Either<Failure, BlogResponse>, BlogParams> {
  @override
  Future<Either<Failure, BlogResponse>> call(BlogParams params) async {
    try {
      final createResult = await sl<BlogRepository>().createBlog(params);

      return await createResult.fold(
        (failure) => Left(failure),
        (blogResponse) async {
          final blogId = blogResponse.id;

          final publishResult = await sl<BlogRepository>().publishBlog(blogId);
          return publishResult.fold(
            (failure) => Left(failure),
            (publishedBlog) => Right(publishedBlog),
          );
        },
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
