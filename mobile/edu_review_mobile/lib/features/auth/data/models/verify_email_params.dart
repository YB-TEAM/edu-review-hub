class VerifyEmailParams {
  final String otp;
  final String email;

  VerifyEmailParams({
    required this.otp,
    required this.email,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'otp': otp,
      'email': email,
    };
  }
}
