import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';
import 'package:equatable/equatable.dart';

abstract class BlogDetailState extends Equatable {
  const BlogDetailState();

  @override
  List<Object?> get props => [];
}

class BlogInitial extends BlogDetailState {}

class BlogLoading extends BlogDetailState {}

class BlogLoaded extends BlogDetailState {
  final BlogResponse blog;

  const BlogLoaded(this.blog);

  @override
  List<Object?> get props => [blog];
}

class BlogError extends BlogDetailState {
  final String message;

  const BlogError(this.message);

  @override
  List<Object?> get props => [message];
}
