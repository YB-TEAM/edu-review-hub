// ignore_for_file: non_constant_identifier_names

import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/features/user_profile/data/data_souces/local/profile_local_service.dart';
import 'package:edu_review_mobile/features/user_profile/data/data_souces/remote/profile_api_service.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class ProfileRepositoryImpl extends ProfileRepository {
  @override
  Future<Either> getUser() async {
    Either result = await sl<ProfileApiService>().getUser();
    return result.fold(
      (error) {
        return Left(error);
      },
      (data) {
        Response response = data;

        //Test API
        final responseData =
            response.data is List ? response.data.first : response.data;
        //

        var profileModel = ProfileModel.fromMap(responseData);
        var profileEntity = profileModel.toEntity();
        return Right(profileEntity);
      },
    );
  }

  @override
  Future logOut() async {
    await sl<ProfileLocalService>().logOut();
  }

  @override
  Future<Either<String, ProfileEntity>> editProfile(
    Map<String, dynamic> profileData,
  ) async {
    Either result = await sl<ProfileApiService>().editProfile(profileData);
    return result.fold(
      (error) {
        return Left(error.toString());
      },
      (data) {
        Response response = data;

        //Test API - lấy phần tử đầu tiên nếu response là list
        final responseData =
            response.data is List ? response.data.first : response.data;
        //

        var profileModel = ProfileModel.fromMap(responseData);
        var profileEntity = profileModel.toEntity();
        return Right(profileEntity);
      },
    );
  }
}
