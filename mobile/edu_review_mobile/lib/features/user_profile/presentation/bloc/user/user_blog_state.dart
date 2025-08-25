import 'package:edu_review_mobile/features/user_profile/data/models/blog_pagination.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';

abstract class UserBlogState {}

class UserBlogInitial extends UserBlogState {}

class UserBlogLoading extends UserBlogState {}

class UserBlogError extends UserBlogState {
  final String message;
  UserBlogError(this.message);
}

class UserBlogLoaded extends UserBlogState {
  final List<BlogResponse> blogList;
  final BlogPagination pagination;
  final bool hasReachedEnd;

  UserBlogLoaded({
    required this.blogList,
    required this.pagination,
    required this.hasReachedEnd,
  });

  UserBlogLoaded copyWith({
    List<BlogResponse>? blogList,
    BlogPagination? pagination,
    bool? hasReachedEnd,
  }) {
    return UserBlogLoaded(
      blogList: blogList ?? this.blogList,
      pagination: pagination ?? this.pagination,
      hasReachedEnd: hasReachedEnd ?? this.hasReachedEnd,
    );
  }
}
