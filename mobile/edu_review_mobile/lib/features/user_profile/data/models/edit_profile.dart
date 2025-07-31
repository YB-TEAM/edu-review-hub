import 'package:edu_review_mobile/features/user_profile/domain/entities/profile.dart';

class EditProfileModel {
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
  final String? timezone;
  final String? language;
  final String? universityName;
  final String? major;
  final int? graduationYear;
  final String? studentId;
  final bool? isStudentVerified;
  final Map<String, bool>? privacySettings;
  final Map<String, bool>? notificationSettings;

  EditProfileModel({
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
    this.timezone,
    this.language,
    this.universityName,
    this.major,
    this.graduationYear,
    this.studentId,
    this.isStudentVerified,
    this.privacySettings,
    this.notificationSettings,
  });

  factory EditProfileModel.fromMap(Map<String, dynamic> map) {
    return EditProfileModel(
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
      timezone: map['timezone'],
      language: map['language'],
      universityName: map['universityName'],
      major: map['major'],
      graduationYear: map['graduationYear'],
      studentId: map['studentId'],
      isStudentVerified: map['isStudentVerified'],
      privacySettings: map['privacySettings']?.cast<String, bool>(),
      notificationSettings: map['notificationSettings']?.cast<String, bool>(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
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
      'timezone': timezone,
      'language': language,
      'universityName': universityName,
      'major': major,
      'graduationYear': graduationYear,
      'studentId': studentId,
      'isStudentVerified': isStudentVerified,
      'privacySettings': privacySettings,
      'notificationSettings': notificationSettings,
    };
  }

  factory EditProfileModel.fromEntity(ProfileEntity entity) {
    return EditProfileModel(
      firstName: entity.firstName,
      lastName: entity.lastName,
      displayName: entity.displayName,
      avatarUrl: entity.avatarUrl,
      coverImageUrl: entity.coverImageUrl,
      bio: entity.bio,
      dateOfBirth: entity.dateOfBirth,
      gender: entity.gender,
      country: entity.country,
      city: entity.city,
      address: entity.address,
      timezone: entity.timezone,
      language: entity.language,
      universityName: entity.universityName,
      major: entity.major,
      graduationYear: entity.graduationYear,
      studentId: entity.studentId,
      isStudentVerified: entity.isStudentVerified,
      privacySettings: entity.privacySettings,
      notificationSettings: entity.notificationSettings,
    );
  }

  ProfileEntity toEntity(ProfileEntity currentProfile) {
    return ProfileEntity(
      userId: currentProfile.userId,
      firstName: currentProfile.firstName,
      lastName: currentProfile.lastName,
      displayName: displayName ?? currentProfile.displayName,
      avatarUrl: currentProfile.avatarUrl,
      coverImageUrl: currentProfile.coverImageUrl,
      bio: bio ?? currentProfile.bio,
      dateOfBirth: currentProfile.dateOfBirth,
      gender: currentProfile.gender,
      country: currentProfile.country,
      city: city ?? currentProfile.city,
      address: currentProfile.address,
      timezone: currentProfile.timezone,
      language: currentProfile.language,
      universityName: universityName ?? currentProfile.universityName,
      major: major ?? currentProfile.major,
      graduationYear: currentProfile.graduationYear,
      studentId: currentProfile.studentId,
      isStudentVerified: currentProfile.isStudentVerified,
      privacySettings: currentProfile.privacySettings,
      notificationSettings: currentProfile.notificationSettings,
      createdAt: currentProfile.createdAt,
      updatedAt: currentProfile.updatedAt,
    );
  }
}
