import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/university/data/models/review_params.dart';
import 'package:edu_review_mobile/features/university/data/models/review_response.dart';
import 'package:edu_review_mobile/features/university/data/models/university_list_response.dart';
import 'package:edu_review_mobile/features/university/data/models/university_pagination.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class UniversityApiService {
  Future<Either<Failure, UniversityListResponse>> getUniversities(UniversityPagination paginations);
  Future<Either<Failure, ReviewResponse>> createReview(ReviewParams reviewParams);
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

  @override
  Future<Either<Failure, ReviewResponse>> createReview(ReviewParams reviewParams) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');
      final response = await sl<DioClient>().post(
        ApiUrls.reviews,
        data: reviewParams.toJson(),
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        ),
      );
      final reviewResponse = ReviewResponse.fromJson(response.data);
      return Right(reviewResponse);
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
