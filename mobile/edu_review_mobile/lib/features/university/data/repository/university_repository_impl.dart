import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/university/data/data_sources/remote/university_api_service.dart';
import 'package:edu_review_mobile/features/university/data/models/university_list_response.dart';
import 'package:edu_review_mobile/features/university/data/models/university_pagination.dart';
import 'package:edu_review_mobile/features/university/domain/repository/university_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';


class UniversityRepositoryImpl extends UniversityRepository {
  @override
  Future<Either<Failure, UniversityListResponse>> getUniversities(UniversityPagination paginations) async {
    return await sl<UniversityApiService>().getUniversities(paginations);
  }
}
