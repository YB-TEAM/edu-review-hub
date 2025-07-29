class ApiUrls {
  static const baseURL = "http://192.168.57.123:3000/api/v1/";
  // static const baseURL = "http://localhost:3000/api/v1/";
  //Authentication URLs
  static const register = "${baseURL}auth/register";
  static const login = "${baseURL}auth/login";
  static const refreshToken = "${baseURL}auth/refresh";
  static const logout = "${baseURL}auth/logout";

  //User Profile URLs
  static const userProfile = "${baseURL}profile/me";
}
