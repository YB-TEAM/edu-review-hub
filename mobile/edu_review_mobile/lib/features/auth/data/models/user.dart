class UserModel {
  final int id;
  final String username;
  final String email;
  final String accountType;
  final String status;
  final bool isVerified;

  UserModel({
    required this.id,
    required this.username,
    required this.email,
    required this.accountType,
    required this.status,
    required this.isVerified,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      accountType: json['accountType'],
      status: json['status'],
      isVerified: json['isVerified'],
    );
  }
}