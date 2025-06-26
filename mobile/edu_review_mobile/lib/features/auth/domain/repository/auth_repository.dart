import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/features/auth/data/models/user.dart';

abstract class AuthRepository {
  Future<Either> signUp(UserModel user);
}