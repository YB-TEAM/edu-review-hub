import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/university/data/models/review_params.dart';
import 'package:edu_review_mobile/features/university/data/models/review_response.dart';
import 'package:edu_review_mobile/features/university/domain/usecases/create_review.dart';
import 'package:edu_review_mobile/features/university/presentation/bloc/create_review_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/service_locator.dart';

class CreateReviewCubit extends Cubit<CreateReviewState> {
  CreateReviewCubit() : super(CreateReviewInitial());

  Future<Either<Failure,ReviewResponse>> createReview(ReviewParams reviewParams) async {
    emit(CreateReviewLoading());

    final result = await sl<CreateReviewUseCase>().call(reviewParams);
    result.fold(
      (error) => emit(CreateReviewFailure(errorMessage: error.message)),
      (_) => emit(CreateReviewSuccess()),
    );
    return result;
  }
}
