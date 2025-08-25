import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/blog/domain/repository/blog_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class ReactionBlogUseCase implements UseCase<void, int> {
  @override
  Future<Either<Failure, void>> call(int blogId) async{
    return await sl<BlogRepository>().reactionBlog(blogId);
  }
}