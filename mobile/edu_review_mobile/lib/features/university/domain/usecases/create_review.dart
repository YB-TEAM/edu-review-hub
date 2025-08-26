import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/university/data/models/review_params.dart';
import 'package:edu_review_mobile/features/university/data/models/review_response.dart';
import 'package:edu_review_mobile/features/university/domain/repository/university_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class CreateReviewUseCase implements UseCase<Either<Failure, ReviewResponse>, ReviewParams> {
  @override
  Future<Either<Failure, ReviewResponse>> call(ReviewParams reviewParams) async {
    try {
      final result = await sl<UniversityRepository>().createReview(reviewParams);
      return result.fold(
        (failure) => Left(failure),
        (blogResponse) => Right(blogResponse),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
