abstract class PublishBlogState {}

class PublishBlogInitial extends PublishBlogState {}

class PublishBlogLoading extends PublishBlogState {}

class PublishBlogSuccess extends PublishBlogState {}

class PublishBlogFailure extends PublishBlogState {
  final String errorMessage;
  PublishBlogFailure({required this.errorMessage});
}
