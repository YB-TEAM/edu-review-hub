import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/constants/api_urls.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/profile.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class ProfileApiService {
  Future<Either<Failure, ProfileEntity>> getUser();
  Future<Either<Failure, ProfileEntity>> editProfile(EditProfileModel profileData);
}

class ProfileApiServiceImpl extends ProfileApiService {
  @override
  Future<Either<Failure, ProfileEntity>> getUser() async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');
      var response = await sl<DioClient>().get(
        ApiUrls.userProfile,
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      var profileModel = ProfileModel.fromMap(response.data);
      return Right(profileModel.toEntity());
    } on DioException catch (e) {
      return Left(ServerFailure(e.response?.data['message'] ?? 'Server Error'));
    }
  }

  @override
  Future<Either<Failure, ProfileEntity>> editProfile(EditProfileModel profileData) async {
    try {
      SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
      var token = sharedPreferences.getString('accessToken');
      var response = await sl<DioClient>().patch(
        ApiUrls.userProfile,
        data: profileData.toMap(),
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        ),
      );
      var profileModel = ProfileModel.fromMap(response.data);
      return Right(profileModel.toEntity());
    } on DioException catch (e) {
      return Left(ServerFailure(
        e.response?.data['message'] ?? 'Some errors occur when edit profile',
      ));
    }
  }
}
