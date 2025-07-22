class AuthTokenModel {
  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final int expiresIn;

  AuthTokenModel({
    required this.accessToken,
    required this.refreshToken,
    required this.tokenType,
    required this.expiresIn,
  });

  factory AuthTokenModel.fromJson(Map<String, dynamic> json) {
    return AuthTokenModel(
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
      tokenType: json['tokenType'],
      expiresIn: json['expiresIn'],
    );
  }
}
