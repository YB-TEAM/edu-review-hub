class ProfileEntity {
  final String email;
  final String userName;
  final String? phoneNumber;
  final String? birthday;
  final String? gender;

  ProfileEntity({
    required this.email,
    required this.userName,
    this.phoneNumber,
    this.birthday,
    this.gender,
  });
}
