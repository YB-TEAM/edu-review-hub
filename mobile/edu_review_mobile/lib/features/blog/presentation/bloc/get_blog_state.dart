import 'package:edu_review_mobile/features/blog/data/models/blog_list_response.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_pagination.dart';

abstract class BlogState {}

class BlogInitial extends BlogState {}

class BlogLoading extends BlogState {}

class BlogLoaded extends BlogState {
  final BlogListResponse blogList;
  final BlogPagination pagination;
  final bool hasReachedEnd;

  BlogLoaded({
    required this.blogList,
    required this.pagination,
    this.hasReachedEnd = false,
  });

  BlogLoaded copyWith({
    BlogListResponse? blogList,
    BlogPagination? pagination,
    bool? hasReachedEnd,
  }) {
    return BlogLoaded(
      blogList: blogList ?? this.blogList,
      pagination: pagination ?? this.pagination,
      hasReachedEnd: hasReachedEnd ?? this.hasReachedEnd,
    );
  }
}

class BlogError extends BlogState {
  final String message;

  BlogError(this.message);
}
