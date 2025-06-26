import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:edu_review_mobile/features/auth/data/models/user.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/service_locator.dart';

class SignUpUseCase implements Usecase<Either, UserModel> {
  @override
  Future<Either> call(UserModel ? param) async{
   return sl<AuthRepository>().signUp(param!);
  }

}