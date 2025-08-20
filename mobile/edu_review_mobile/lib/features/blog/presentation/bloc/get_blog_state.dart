import 'package:edu_review_mobile/features/blog/data/models/blog_list_response.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_pagination.dart';

abstract class BlogState {}

class BlogInitial extends BlogState {}

class BlogLoading extends BlogState {}

class BlogLoaded extends BlogState {
  final BlogListResponse blogList;
  final BlogPagination pagination;

  BlogLoaded({
    required this.blogList,
    required this.pagination,
  });
}

class BlogError extends BlogState {
  final String message;

  BlogError(this.message);
}
