import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/models/tag_response.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/service_locator.dart';

abstract class GetTagApiService {
  Future<Either<Failure, List<TagResponse>>> getTags();
}

class GetTagApiServiceImpl extends GetTagApiService {
  @override
  Future<Either<Failure, List<TagResponse>>> getTags() async {
    try {
      var response = await sl<DioClient>().get(
        ApiUrls.getTags, 
      );

      var tags = (response.data as List)
          .map((tag) => TagResponse.fromMap(tag))
          .toList();

      return Right(tags);
    } on DioException catch (e) {
      return Left(
        ServerFailure(
          message: e.response?.data['message'] ?? 'Some errors occur when fetching tags',
          statusCode: e.response?.statusCode,
        ),
      );
    }
  }
}
