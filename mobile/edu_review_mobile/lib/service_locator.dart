import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:get_it/get_it.dart';

final sl = GetIt.instance;

void setUpServiceLocator() {
  sl.registerSingleton<DioClient>(DioClient());
}