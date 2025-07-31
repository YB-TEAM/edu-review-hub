class ProfileEntity {
  final String userId;
  final String? firstName;
  final String? lastName;
  final String? displayName;
  final String? avatarUrl;
  final String? coverImageUrl;
  final String? bio;
  final String? dateOfBirth;
  final String? gender;
  final String? country;
  final String? city;
  final String? address;
  final String timezone;
  final String language;
  final String? universityName;
  final String? major;
  final int? graduationYear;
  final String? studentId;
  final bool isStudentVerified;
  final Map<String, bool>? privacySettings;
  final Map<String, bool>? notificationSettings;
  final String createdAt;
  final String updatedAt;

  ProfileEntity({
    required this.userId,
    this.firstName,
    this.lastName,
    this.displayName,
    this.avatarUrl,
    this.coverImageUrl,
    this.bio,
    this.dateOfBirth,
    this.gender,
    this.country,
    this.city,
    this.address,
    required this.timezone,
    required this.language,
    this.universityName,
    this.major,
    this.graduationYear,
    this.studentId,
    required this.isStudentVerified,
    this.privacySettings,
    this.notificationSettings,
    required this.createdAt,
    required this.updatedAt,
  });
}
