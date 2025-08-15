class ResetPasswordParams {
  final String otp;
  final String email;
  final String newPassword;

  ResetPasswordParams({
    required this.otp,
    required this.email,
    required this.newPassword,
  });

  Map<String, dynamic> toJson() {
    return {
      'otp': otp,
      'email': email,
      'newPassword': newPassword,
    };
  }
}
