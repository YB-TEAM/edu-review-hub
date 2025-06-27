import 'package:dartz/dartz.dart';

abstract class ProfileRepository {
  Future<Either> getUser();
  Future logOut();
}