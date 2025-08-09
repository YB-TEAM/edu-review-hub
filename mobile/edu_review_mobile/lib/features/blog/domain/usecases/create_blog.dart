import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/blog/domain/repository/blog_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class CreateBlogUseCase implements UseCase<Either<Failure, BlogResponse>, BlogParams> {
  @override
  Future<Either<Failure, BlogResponse>> call(BlogParams blogParams) async {
    try {
      final result = await sl<BlogRepository>().createBlog(blogParams);
      return result.fold(
        (failure) => Left(failure),
        (blogResponse) => Right(blogResponse),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
