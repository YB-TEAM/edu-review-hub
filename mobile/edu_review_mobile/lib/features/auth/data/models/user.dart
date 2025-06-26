class UserModel {
  final String email;
  final String password;
  final String userName;

  UserModel({
    required this.email, 
    required this.password, 
    required this.userName
  });

  // Chuyển đổi object thành JSON
  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'email': email,
      'password': password,
      'userName': userName,
    };
  }

}
