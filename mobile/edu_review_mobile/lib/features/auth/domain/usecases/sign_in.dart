import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class SignInUseCase implements UseCase<Either, SignInParams> {
  @override
  Future<Either> call(SignInParams ? param) async{
   return sl<AuthRepository>().signIn(param!);
  }

}