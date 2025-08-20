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

  Future<Either<Failure, BlogListResponse>> fetchBlogs({BlogPagination? pagination}) async {
    emit(BlogLoading());

    final params = pagination ??
      BlogPagination(
        page: 1,
        pageSize: 10,
      );

    final result = await sl<GetBlogsUseCase>().call(params);

    result.fold(
      (failure) => emit(BlogError(failure.message)),
      (blogListResponse) =>
          emit(BlogLoaded(blogList: blogListResponse, pagination: params)),
    );

    return result;
  }
  Future<Either<Failure, BlogListResponse>> loadMoreBlogs(BlogPagination pagination) async {
    if (state is BlogLoaded) {
      final currentState = state as BlogLoaded;

      final nextPage = pagination.copyWith(page: pagination.page + 1);

      final result = await sl<GetBlogsUseCase>().call(nextPage);

      result.fold(
        (failure) => emit(BlogError(failure.message)),
        (blogListResponse) {
          final updatedBlogList = BlogListResponse(
            data: [
              ...currentState.blogList.data,
              ...blogListResponse.data,
            ],
            metadata: blogListResponse.metadata,
            statistics: blogListResponse.statistics,
          );

          emit(BlogLoaded(blogList: updatedBlogList, pagination: nextPage));
        },
      );

      return result;
    }

    return Left(ServerFailure(message: 'Không thể load thêm blog'));
  }
}
