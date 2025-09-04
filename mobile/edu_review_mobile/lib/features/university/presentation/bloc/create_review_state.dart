abstract class CreateReviewState {}

class CreateReviewInitial extends CreateReviewState {}

class CreateReviewLoading extends CreateReviewState {}

class CreateReviewSuccess extends CreateReviewState {}

class CreateReviewFailure extends CreateReviewState {
  final String errorMessage;
  CreateReviewFailure({required this.errorMessage});
}
