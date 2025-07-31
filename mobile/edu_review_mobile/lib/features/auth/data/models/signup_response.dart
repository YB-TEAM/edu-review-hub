import 'package:edu_review_mobile/features/auth/data/models/user.dart';

class SignUpResponse {
  final String message;
  final UserModel user;

  SignUpResponse({
    required this.message,
    required this.user,
  });

  factory SignUpResponse.fromJson(Map<String, dynamic> json) {
    return SignUpResponse(
      message: json['message'],
      user: UserModel.fromJson(json['user']),
    );
  }
}
