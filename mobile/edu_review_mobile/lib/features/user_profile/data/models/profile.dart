import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

class ProfileModel {
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
  final String timeZone;
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

  ProfileModel({
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
    required this.timeZone,
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

  factory ProfileModel.fromMap(Map<String, dynamic> map) {
    return ProfileModel(
      userId: map['userId'] ?? 0,
      firstName: map['firstName'],
      lastName: map['lastName'],
      displayName: map['displayName'],
      avatarUrl: map['avatarUrl'],
      coverImageUrl: map['coverImageUrl'],
      bio: map['bio'],
      dateOfBirth: map['dateOfBirth'],
      gender: map['gender'],
      country: map['country'],
      city: map['city'],
      address: map['address'],
      timeZone: map['timeZone'] ?? 'UTC',
      language: map['language'] ?? 'vi',
      universityName: map['universityName'],
      major: map['major'],
      graduationYear: map['graduationYear'],
      studentId: map['studentId'],
      isStudentVerified: map['isStudentVerified'] ?? false,
      privacySettings: (map['privacySettings'] as Map?)?.cast<String, bool>(),
      notificationSettings: (map['notificationSettings'] as Map?)?.cast<String, bool>(),
      createdAt: map['createdAt'] ?? '',
      updatedAt: map['updatedAt'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'firstName': firstName,
      'lastName': lastName,
      'displayName': displayName,
      'avatarUrl': avatarUrl,
      'coverImageUrl': coverImageUrl,
      'bio': bio,
      'dateOfBirth': dateOfBirth,
      'gender': gender,
      'country': country,
      'city': city,
      'address': address,
      'timeZone': timeZone,
      'language': language,
      'universityName': universityName,
      'major': major,
      'graduationYear': graduationYear,
      'studentId': studentId,
      'isStudentVerified': isStudentVerified,
      'privacySettings': privacySettings,
      'notificationSettings': notificationSettings,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}

extension ProfileXModel on ProfileModel {
  ProfileEntity toEntity() {
    return ProfileEntity(
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
      avatarUrl: avatarUrl,
      coverImageUrl: coverImageUrl,
      bio: bio,
      dateOfBirth: dateOfBirth,
      gender: gender,
      country: country,
      city: city,
      address: address,
      timeZone: timeZone,
      language: language,
      universityName: universityName,
      major: major,
      graduationYear: graduationYear,
      studentId: studentId,
      isStudentVerified: isStudentVerified,
      privacySettings: privacySettings,
      notificationSettings: notificationSettings,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
