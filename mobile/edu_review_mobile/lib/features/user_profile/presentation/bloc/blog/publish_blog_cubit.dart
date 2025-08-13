import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/publish_blog.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/blog/publish_blog_state.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class UserPublishBlogCubit extends Cubit<PublishBlogState> {
  UserPublishBlogCubit() : super(PublishBlogInitial());

   Future<Either<Failure,BlogResponse>> publishBlog(int blogId) async {
    emit(PublishBlogLoading());

    final result = await sl<UserPublishBlogUseCase>().call(blogId);
    result.fold(
      (error) => emit(PublishBlogFailure(errorMessage: error.message)),
      (_) => emit(PublishBlogSuccess()),
    );
    return result;
  }
}