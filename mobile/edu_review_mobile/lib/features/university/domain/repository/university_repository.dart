import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/university/data/models/review_params.dart';
import 'package:edu_review_mobile/features/university/data/models/review_response.dart';
import 'package:edu_review_mobile/features/university/data/models/university_list_response.dart';
import 'package:edu_review_mobile/features/university/data/models/university_pagination.dart';

abstract class UniversityRepository {
  Future<Either<Failure, UniversityListResponse>> getUniversities(UniversityPagination paginations);
  Future<Either<Failure, ReviewResponse>> createReview(ReviewParams reviewParams);
}
