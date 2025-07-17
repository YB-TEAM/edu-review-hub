// ignore_for_file: non_constant_identifier_names
import 'package:edu_review_mobile/features/settings/data/data_sources/local/settings_local_service.dart';
import 'package:edu_review_mobile/features/settings/domain/repository/settings_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class SettingsRepositoryImpl extends SettingsRepository {
  @override
  Future logOut() async {
    await sl<SettingsLocalService>().logOut();
  }
}
