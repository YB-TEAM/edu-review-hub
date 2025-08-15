import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/university/data/models/university_pagination.dart';
import 'package:edu_review_mobile/service_locator.dart';

abstract class UniversityApiService {
  Future<Either<Failure, UniversityPagination>> getUniversities();
}

class UniversityApiServiceImpl extends UniversityApiService {
  @override
  Future<Either<Failure, UniversityPagination>> getUniversities({
    int limit = 10,
    int page = 1,
    String? search,
    String? location,
    String? type,
  }) async {
    try {
      final response = await sl<DioClient>().get(
        ApiUrls.getUniversities,
        queryParameters: {
          'limit': limit,
          'page': page,
          if (search != null && search.isNotEmpty) 'search': search,
          if (location != null && location.isNotEmpty) 'location': location,
          if (type != null && type.isNotEmpty) 'type': type,
        },
      );

      final universityResponse = UniversityPagination.fromJson(response.data);
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
