import 'dart:io';
import 'package:dartz/dartz.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/settings/data/data_sources/local/settings_local_service.dart';
import 'package:edu_review_mobile/features/settings/data/data_sources/remote/settings_api_service.dart';
import 'package:edu_review_mobile/features/settings/domain/repository/settings_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class SettingsRepositoryImpl implements SettingsRepository {
  @override
  Future<Either<Failure, void>> logOut() async {
    try {
      String deviceId;
      if (Platform.isAndroid) {
        final androidInfo = await sl<DeviceInfoPlugin>().androidInfo;
        deviceId = androidInfo.id;
      } else if (Platform.isIOS) {
        final iosInfo = await sl<DeviceInfoPlugin>().iosInfo;
        deviceId = iosInfo.identifierForVendor ?? '';
      } else {
        deviceId = 'unknown';
      }

      final result = await sl<SettingsApiService>().logout(deviceId);
      
      if (result.isRight()) {
        await sl<SettingsLocalService>().logOut();
      }
      return result;
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
