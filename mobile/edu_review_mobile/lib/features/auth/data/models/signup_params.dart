class SignUpParams {
  final String username;
  final String email;
  final String password;
  final String? phone;
  final String? accountType;

  SignUpParams({
    required this.username,
    required this.email, 
    required this.password, 
    this.phone,
    this.accountType,
  });

  Map<String, dynamic> toMap() {
    final map = <String, dynamic>{
      'username': username,
      'email': email,
      'password': password,
    };
    if (phone != null) {
      map['phone'] = phone;
    }
    if (accountType != null) {
      map['accountType'] = accountType;
    }
    return map;
  }
}
