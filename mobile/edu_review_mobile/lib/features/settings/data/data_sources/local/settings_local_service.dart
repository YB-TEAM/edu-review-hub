import 'package:shared_preferences/shared_preferences.dart';

abstract class SettingsLocalService {
  Future logOut();
}

class SettingsLocalServiceImpl extends SettingsLocalService {
  @override
  Future logOut() async {
    SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
    sharedPreferences.clear();
  }
}
