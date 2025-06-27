class SignUpParams {
  final String email;
  final String password;
  final String userName;
  final String token;

  SignUpParams({
    required this.email, 
    required this.password, 
    required this.userName,
    required this.token,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'email': email,
      'password': password,
      'userName': userName,
      'token': token,
    };
  }

}
