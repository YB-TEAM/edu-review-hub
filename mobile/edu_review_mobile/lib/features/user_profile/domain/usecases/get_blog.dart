import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_pagination.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class GetMyBlogUseCase implements UseCase<Either<Failure, List<BlogResponse>>, BlogPagination> {
  @override
  Future<Either<Failure, List<BlogResponse>>> call(BlogPagination pagination) async {
    return sl<ProfileRepository>().getBlogs(pagination);
  }
}
