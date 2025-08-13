import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class DeleteBlogUseCase implements UseCase<Either<Failure, void>, int> {
  @override
  Future<Either<Failure, void>> call(int blogId) async {
    return sl<ProfileRepository>().deleteBlog(blogId);
  }
}
