class ApiUrls {
  static const baseURL = "http://192.168.99.110:3000/api/v1/";
  //Authentication URLs
  static const register = "${baseURL}auth/register";
  static const login = "${baseURL}auth/login";
  static const refreshToken = "${baseURL}auth/refresh";

  //User Profile URLs
  static const userProfile = "${baseURL}profile/me";
}
