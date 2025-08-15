import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/university/data/models/university_pagination.dart';

abstract class UniversityRepository {
  Future<Either<Failure, UniversityPagination>> getUniversities();
}
