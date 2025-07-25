import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/settings/domain/repository/settings_repository.dart';
import 'package:edu_review_mobile/core/usecases/no_params.dart';
import 'package:edu_review_mobile/service_locator.dart';

class LogOutUseCase implements UseCase<void, NoParams> {
  @override
  Future<Either<Failure, void>> call(NoParams params) async {
    return await sl<SettingsRepository>().logOut();
  }
}