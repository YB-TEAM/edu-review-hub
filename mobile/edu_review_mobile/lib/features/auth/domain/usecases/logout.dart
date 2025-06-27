import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class LogOutUseCase implements UseCase<dynamic, dynamic> {

  @override
  Future<Either<String, dynamic>> call(param) async {
    try {
      await sl<AuthRepository>().logOut();
      return Right(null);
    } catch (e) {
      return Left(e.toString());
    }
  }
}