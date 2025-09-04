import 'package:edu_review_mobile/features/blog/domain/usecases/get_blog_detail.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/get_blog_detail_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/service_locator.dart';

class BlogDetailCubit extends Cubit<BlogDetailState> {
  final GetBlogDetailUseCase _getBlogsUseCase = sl<GetBlogDetailUseCase>();

  BlogDetailCubit() : super(BlogInitial());

  Future<void> getBlogDetail(int blogId) async {
    emit(BlogLoading());

    final result = await _getBlogsUseCase(blogId);

    result.fold(
      (failure) => emit(BlogError(failure.message)),
      (blog) => emit(BlogLoaded(blog)),
    );
  }
}
