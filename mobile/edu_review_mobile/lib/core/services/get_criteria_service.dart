import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/models/criteria_response.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/service_locator.dart';

abstract class GetCriteriaApiService {
  Future<Either<Failure, List<CriteriaResponse>>> getCriterias();
}

class GetCriteriaApiServiceImpl extends GetCriteriaApiService {
  @override
  Future<Either<Failure, List<CriteriaResponse>>> getCriterias() async {
    try {
      final response = await sl<DioClient>().get(ApiUrls.criterias);

      // Vì response.data chính là List rồi
      final dataList = response.data as List<dynamic>;

      final criterias = dataList
          .map((item) => CriteriaResponse.fromMap(item as Map<String, dynamic>))
          .toList();

      return Right(criterias);
    } on DioException catch (e) {
      return Left(
        ServerFailure(
          message: e.response?.data['message'] ??
              'Some errors occur when fetching criterias',
          statusCode: e.response?.statusCode,
        ),
      );
    }
  }
}


