import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_edit_params.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class EditBlogUseCase implements UseCase<Either<Failure, BlogResponse>, EditBlogParams> {
  @override
  Future<Either<Failure, BlogResponse>> call(EditBlogParams editBlogParams) async {
    try {
      final result = await sl<ProfileRepository>().editBlog(editBlogParams);
      return result.fold(
        (failure) => Left(failure),
        (blogResponse) => Right(blogResponse),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}