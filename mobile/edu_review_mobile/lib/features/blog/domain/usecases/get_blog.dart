import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_list_response.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_pagination.dart';
import 'package:edu_review_mobile/features/blog/domain/repository/blog_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class GetBlogsUseCase implements UseCase<Either<Failure, BlogListResponse>, BlogPagination> {
  @override
  Future<Either<Failure, BlogListResponse>> call(BlogPagination paginations) async {
    try {
      final result = await sl<BlogRepository>().getBlogs(paginations);
      return result.fold(
        (failure) => Left(failure),
        (blogList) => Right(blogList),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
