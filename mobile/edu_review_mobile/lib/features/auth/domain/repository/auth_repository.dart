import 'package:dartz/dartz.dart';

abstract class AuthRepository {
  Future<Either> signUp();
}