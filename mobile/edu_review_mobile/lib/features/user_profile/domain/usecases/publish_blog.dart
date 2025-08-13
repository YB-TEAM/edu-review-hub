import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class UserPublishBlogUseCase
    implements UseCase<Either<Failure, BlogResponse>, int> {
  @override
  Future<Either<Failure, BlogResponse>> call(int blogId) async {
    try {
      final publishResult = await sl<ProfileRepository>().publishBlog(blogId);
      return publishResult.fold(
        (failure) => Left(failure),
        (publishedBlog) => Right(publishedBlog),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
