import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/create_blog.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/create_blog_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/service_locator.dart';

class CreateBlogCubit extends Cubit<CreateBlogState> {
  CreateBlogCubit() : super(CreateBlogInitial());

  Future<void> createBlog(BlogParams blogParams) async {
    emit(CreateBlogLoading());

    final result = await sl<CreateBlogUseCase>().call(blogParams);
    result.fold(
      (error) => emit(CreateBlogFailure(errorMessage: error.message)),
      (_) => emit(CreateBlogSuccess()),
    );
  }
}
