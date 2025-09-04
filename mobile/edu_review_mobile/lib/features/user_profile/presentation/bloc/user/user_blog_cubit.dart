import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_pagination.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/get_blog.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/user_blog_state.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class UserBlogCubit extends Cubit<UserBlogState> {
  UserBlogCubit() : super(UserBlogInitial());

  Future<Either<Failure, List<BlogResponse>>> fetchBlogs({
    required BlogPagination pagination,
  }) async {
    emit(UserBlogLoading());

    final result = await sl<GetMyBlogUseCase>().call(pagination);

    result.fold(
      (failure) => emit(UserBlogError(failure.message)),
      (List<BlogResponse> blogs) {
        final hasReachedEnd = blogs.length < pagination.limit;
        emit(UserBlogLoaded(
          blogList: blogs,
          pagination: pagination,
          hasReachedEnd: hasReachedEnd,
        ));
      },
    );

    return result;
  }

  Future<Either<Failure, List<BlogResponse>>> loadMoreBlogs(
    BlogPagination pagination,
  ) async {
    if (state is UserBlogLoaded) {
      final currentState = state as UserBlogLoaded;

      if (currentState.hasReachedEnd) {
        return Left(ServerFailure(message: 'Đã load hết dữ liệu'));
      }

      final nextPage = pagination.copyWith(page: pagination.page + 1);

      final result = await sl<GetMyBlogUseCase>().call(nextPage);

      result.fold(
        (failure) => emit(UserBlogError(failure.message)),
        (List<BlogResponse> newItems) {
          final hasReachedEnd = newItems.length < pagination.limit;

          final updatedBlogList = [
            ...currentState.blogList,
            ...newItems,
          ];

          emit(currentState.copyWith(
            blogList: updatedBlogList,
            pagination: nextPage,
            hasReachedEnd: hasReachedEnd,
          ));
        },
      );

      return result;
    }

    return Left(ServerFailure(message: 'Không thể load thêm blog'));
  }
}
