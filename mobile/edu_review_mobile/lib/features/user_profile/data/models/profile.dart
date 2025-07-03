import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

class ProfileModel {
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

  ProfileModel({
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

  factory ProfileModel.fromMap(Map<String, dynamic> map) {
    return ProfileModel(
      userID: BigInt.parse(map['userID'].toString()),
      bio: map['bio'],
      birthday:
          map['birthday'] != null
              ? DateTime.fromMillisecondsSinceEpoch(map['birthday'])
              : null,
      address: map['address'],
      graduationYear: map['graduationYear'],
      isStudent: map['isStudent'] ?? false,
      createAt:
          map['createAt'] != null
              ? DateTime.fromMillisecondsSinceEpoch(map['createAt'])
              : DateTime.now(),
      updatedAt:
          map['updatedAt'] != null
              ? DateTime.fromMillisecondsSinceEpoch(map['updatedAt'])
              : DateTime.now(),
      firstName: map['firstName'],
      lastName: map['lastName'],
      displayName: map['displayName'],
      avatarUrl: map['avatarUrl'],
      coverImageUrl: map['coverImageUrl'],
      gender: map['gender'],
      country: map['country'],
      city: map['city'],
      timeZone: map['timeZone'] ?? 'UTC',
      language: map['language'] ?? 'vi',
      universityName: map['universityName'],
      major: map['major'],
      studentId: map['studentId'],
    );
  }
}

extension ProfileXModel on ProfileModel {
  ProfileEntity toEntity() {
    return ProfileEntity(
      userID: userID,
      bio: bio,
      birthday: birthday,
      address: address,
      graduationYear: graduationYear,
      isStudent: isStudent,
      createAt: createAt,
      updatedAt: updatedAt,
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
      avatarUrl: avatarUrl,
      coverImageUrl: coverImageUrl,
      gender: gender,
      country: country,
      city: city,
      timeZone: timeZone,
      language: language,
      universityName: universityName,
      major: major,
      studentId: studentId,
    );
  }
}
