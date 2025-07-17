class SignInParams {
  final String identifier;
  final String password;
  final String? deviceId;
  final bool? rememberMe;

  SignInParams({
    required this.identifier,
    required this.password,
    this.deviceId,
    this.rememberMe,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'identifier': identifier,
      'password': password,
      if (deviceId != null) 'deviceId': deviceId,
      if (rememberMe != null) 'rememberMe': rememberMe,
    };
  }
}
