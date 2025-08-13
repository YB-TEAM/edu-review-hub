import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_edit_params.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/edit_blog.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/blog/edit_blog_state.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class EditBlogCubit extends Cubit<EditBlogState> {
  EditBlogCubit() : super(EditBlogInitial());

  Future<Either<Failure,BlogResponse>> editBlog(EditBlogParams editBlogParams) async {
    emit(EditBlogLoading());
    final result = await sl<EditBlogUseCase>().call(editBlogParams);
    result.fold(
      (error) => emit(EditBlogFailure(errorMessage: error.message)),
      (_) => emit(EditBlogSuccess()),
    );
    return result;
  }
}
