import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/university/data/models/university_list_response.dart';
import 'package:edu_review_mobile/features/university/data/models/university_pagination.dart';
import 'package:edu_review_mobile/service_locator.dart';

abstract class UniversityApiService {
  Future<Either<Failure, UniversityListResponse>> getUniversities(UniversityPagination paginations);
}

class UniversityApiServiceImpl extends UniversityApiService {
  @override
  Future<Either<Failure, UniversityListResponse>> getUniversities(UniversityPagination paginations) async {
    try {
      final response = await sl<DioClient>().get(
        ApiUrls.getUniversities,
        queryParameters: {
          'limit': paginations.limit,
          'page': paginations.page,
          if (paginations.search != null && paginations.search!.isNotEmpty) 'search': paginations.search,
          if (paginations.location != null && paginations.location!.isNotEmpty) 'location': paginations.location,
          if (paginations.type != null && paginations.type!.isNotEmpty) 'type': paginations.type,
        },
      );

      final universityResponse = UniversityListResponse.fromJson(response.data);
      return Right(universityResponse);
    } on DioException catch (e) {
      return Left(
        ServerFailure(
          message: e.response?.data['message'] ?? 'Unknown error',
          statusCode: e.response?.statusCode,
        ),
      );
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
