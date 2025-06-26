import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/remote/auth_api_service.dart';
import 'package:edu_review_mobile/features/auth/data/repository/auth_repository_imp.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/sign_up.dart';
import 'package:get_it/get_it.dart';

final sl = GetIt.instance;

void setUpServiceLocator() {
  sl.registerSingleton<DioClient>(DioClient());

  // Service
  sl.registerSingleton<AuthApiService>(
    AuthApiServiceImpl()
  );

  // Repositories
  sl.registerSingleton<AuthRepository>(
    AuthRepositoryImpl()
  );

  // Usecases
  sl.registerSingleton<SignUpUseCase>(
    SignUpUseCase()
  );
}