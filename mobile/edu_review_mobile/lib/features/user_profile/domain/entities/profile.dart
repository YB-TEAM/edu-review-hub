class ProfileEntity {
  final BigInt userID;
  final String? bio;
  final DateTime? birthday;
  final String? address;
  final int? graduationYear;
  final bool isStudent;
  final DateTime createAt;
  final DateTime updatedAt;
  final String? firstName;
  final String? lastName;
  final String? displayName;
  final String? avatarUrl;
  final String? coverImageUrl;
  final String? gender;
  final String? country;
  final String? city;
  final String timeZone;
  final String language;
  final String? universityName;
  final String? major;
  final String? studentId;

  ProfileEntity({
    required this.userID,
    this.bio,
    this.birthday,
    this.address,
    this.graduationYear,
    required this.isStudent,
    required this.createAt,
    required this.updatedAt,
    this.firstName,
    this.lastName,
    this.displayName,
    this.avatarUrl,
    this.coverImageUrl,
    this.gender,
    this.country,
    this.city,
    required this.timeZone,
    required this.language,
    this.universityName,
    this.major,
    this.studentId,
  });
}
