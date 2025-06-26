import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';

abstract class AuthApiService {
  Future<Either> signUp();
}

// class AuthApiServiceImpl extends AuthApiService {

//   @override
//   Future<Either> signUp() {
//     try {
//       sl<DioClient>().post(
//         ApiUrls.register
//       );
//     } catch {

//     }
//   }
// }