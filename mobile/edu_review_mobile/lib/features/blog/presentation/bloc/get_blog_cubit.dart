import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_pagination.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_list_response.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/get_blog.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/get_blog_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/service_locator.dart';

class GetBlogCubit extends Cubit<BlogState> {
  GetBlogCubit() : super(BlogInitial());

  /// Fetch initial blogs
  Future<Either<Failure, BlogListResponse>> fetchBlogs({BlogPagination? pagination}) async {
    emit(BlogLoading());

    final params = pagination ?? BlogPagination(page: 1, pageSize: 10);

    final result = await sl<GetBlogsUseCase>().call(params);

    result.fold(
      (failure) => emit(BlogError(failure.message)),
      (blogListResponse) {
        // Dừng load nếu tổng item đã nhỏ hơn pageSize
        final hasReachedEnd = blogListResponse.data.length < params.pageSize;

        emit(BlogLoaded(
          blogList: blogListResponse,
          pagination: params,
          hasReachedEnd: hasReachedEnd,
        ));
      },
    );

    return result;
  }

  /// Load more blogs for pagination
  Future<Either<Failure, BlogListResponse>> loadMoreBlogs(BlogPagination pagination) async {
    if (state is BlogLoaded) {
      final currentState = state as BlogLoaded;

      // Nếu đã load hết dữ liệu thì không load nữa
      if (currentState.hasReachedEnd) {
        return Left(ServerFailure(message: 'Đã load hết dữ liệu'));
      }

      final nextPage = pagination.copyWith(page: pagination.page + 1);

      final result = await sl<GetBlogsUseCase>().call(nextPage);

      result.fold(
        (failure) => emit(BlogError(failure.message)),
        (blogListResponse) {
          final newItems = blogListResponse.data;

          // Nếu server trả ít hơn pageSize => trang cuối
          final hasReachedEnd = newItems.length < pagination.pageSize;

          final updatedBlogList = BlogListResponse(
            data: [...currentState.blogList.data, ...newItems],
            metadata: blogListResponse.metadata,
            statistics: blogListResponse.statistics,
          );

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
