import 'package:equatable/equatable.dart';

abstract class DeleteBlogState extends Equatable {
  @override
  List<Object?> get props => [];
}

class DeleteBlogInitial extends DeleteBlogState {}

class DeleteBlogLoading extends DeleteBlogState {}

class DeleteBlogSuccess extends DeleteBlogState {}

class DeleteBlogFailure extends DeleteBlogState {
  final String errorMessage;
  DeleteBlogFailure({required this.errorMessage});

  @override
  List<Object?> get props => [errorMessage];
}
