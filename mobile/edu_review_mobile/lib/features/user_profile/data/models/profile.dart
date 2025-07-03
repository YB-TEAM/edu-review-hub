import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

class ProfileModel {
  final String? birthday;

  final String email;
  final String userName;
  final String? phoneNumber;
  final String? gender;

  ProfileModel({
    required this.email,
    required this.userName,
    this.phoneNumber,
    this.birthday,
    this.gender,
  });

  factory ProfileModel.fromMap(Map<String, dynamic> map) {
    return ProfileModel(
      email: map['email'] as String,
      userName: map['username'] as String,
      phoneNumber: map['phone'] as String?,
      birthday: map['birthDate'] as String?,
      gender: map['gender'] as String?,
    );
  }
}

extension ProfileXModel on ProfileModel {
  ProfileEntity toEntity() {
    return ProfileEntity(
      email: email,
      userName: userName,
      phoneNumber: phoneNumber,
      birthday: birthday,
      gender: gender,
    );
  }
}
