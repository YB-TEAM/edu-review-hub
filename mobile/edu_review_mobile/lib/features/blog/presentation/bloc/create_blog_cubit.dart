import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/create_blog.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/publish_blog.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/create_blog_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/service_locator.dart';

class CreateBlogCubit extends Cubit<CreateBlogState> {
  CreateBlogCubit() : super(CreateBlogInitial());

  Future<Either<Failure,BlogResponse>> saveBlog(BlogParams blogParams) async {
    emit(CreateBlogLoading());

    final result = await sl<CreateBlogUseCase>().call(blogParams);
    result.fold(
      (error) => emit(CreateBlogFailure(errorMessage: error.message)),
      (_) => emit(CreateBlogSuccess()),
    );
    return result;
  }

   Future<Either<Failure,BlogResponse>> publishBlog(int blogId) async {
    emit(CreateBlogLoading());

    final result = await sl<PublishBlogUseCase>().call(blogId);
    result.fold(
      (error) => emit(CreateBlogFailure(errorMessage: error.message)),
      (_) => emit(CreateBlogSuccess()),
    );
    return result;
  }
}
