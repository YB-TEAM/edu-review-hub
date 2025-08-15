abstract class EditBlogState {}

class EditBlogInitial extends EditBlogState {}

class EditBlogLoading extends EditBlogState {}

class EditBlogSuccess extends EditBlogState {}

class EditBlogFailure extends EditBlogState {
  final String errorMessage;
  EditBlogFailure({required this.errorMessage});
}
