abstract class CreateBlogState {}

class CreateBlogInitial extends CreateBlogState {}

class CreateBlogLoading extends CreateBlogState {}

class CreateBlogSuccess extends CreateBlogState {}

class CreateBlogFailure extends CreateBlogState {
  final String errorMessage;
  CreateBlogFailure({required this.errorMessage});
}
