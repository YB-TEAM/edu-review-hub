import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/university/data/models/university_list_response.dart';
import 'package:edu_review_mobile/features/university/data/models/university_pagination.dart';
import 'package:edu_review_mobile/features/university/domain/repository/university_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class GetUniversityUseCase
    implements UseCase<Either<Failure, UniversityListResponse>, UniversityPagination> {
  @override
  Future<Either<Failure, UniversityListResponse>> call(UniversityPagination paginations) async {
    return sl<UniversityRepository>().getUniversities(paginations);
  }
}
