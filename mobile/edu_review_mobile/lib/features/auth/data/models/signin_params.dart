class SignInParams {
  final String email;
  final String password;
  final String token;

  SignInParams({
    required this.email, 
    required this.password, 
    required this.token,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'email': email,
      'password': password,
      'token': token,
    };
  }

}
