import 'package:shared_preferences/shared_preferences.dart';

abstract class ProfileLocalService {
  Future logOut();
}

class ProfileLocalServiceImpl extends ProfileLocalService {

  @override
  Future logOut() async {
    SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
    sharedPreferences.clear();
  }
}
