import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/blog/domain/repository/blog_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class GetBlogDetailUseCase implements UseCase<Either<Failure, BlogResponse>, int> {
  @override
  Future<Either<Failure, BlogResponse>> call(int blogId) async {
    try {
      final result = await sl<BlogRepository>().getBlogDetail(blogId);
      return result.fold(
        (failure) => Left(failure),
        (blogList) => Right(blogList),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
