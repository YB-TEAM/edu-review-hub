import 'package:edu_review_mobile/features/user_profile/presentation/bloc/delete_blog_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/delete_blog.dart';
import 'package:edu_review_mobile/service_locator.dart';

class DeleteBlogCubit extends Cubit<DeleteBlogState> {
  DeleteBlogCubit() : super(DeleteBlogInitial());

  Future<void> deleteBlog(int blogId) async {
    emit(DeleteBlogLoading());

    final deleteResult = await sl<DeleteBlogUseCase>().call(blogId);

    deleteResult.fold(
      (failure) => emit(DeleteBlogFailure(errorMessage: failure.message)),
      (_) => emit(DeleteBlogSuccess()),
    );
  }
}
