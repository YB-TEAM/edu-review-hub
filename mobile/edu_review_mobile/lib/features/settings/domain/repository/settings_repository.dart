import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';

abstract class SettingsRepository {
  Future<Either<Failure, void>> logOut();
}
