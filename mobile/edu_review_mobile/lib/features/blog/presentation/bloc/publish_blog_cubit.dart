import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/publish_blog.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/publish_blog_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/service_locator.dart';

class PublishBlogCubit extends Cubit<PublishBlogState> {
  PublishBlogCubit() : super(PublishBlogInitial());

   Future<Either<Failure,BlogResponse>> publishBlog(BlogParams params) async {
    emit(PublishBlogLoading());

    final result = await sl<PublishBlogUseCase>().call(params);
    result.fold(
      (error) => emit(PublishBlogFailure(errorMessage: error.message)),
      (_) => emit(PublishBlogSuccess()),
    );
    return result;
  }
}
