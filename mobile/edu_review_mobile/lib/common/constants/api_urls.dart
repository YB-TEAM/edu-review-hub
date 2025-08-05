class ApiUrls {
  static const baseURL = "http://192.168.1.134:3000/api/v1/";
  // static const baseURL = "http://localhost:3000/api/v1/";
  //Authentication URLs
  static const register = "${baseURL}auth/register";
  static const login = "${baseURL}auth/login";
  static const refreshToken = "${baseURL}auth/refresh";
  static const logout = "${baseURL}auth/logout";

  //Email Verification
  static const verifyEmail = "${baseURL}email-verification/verify-email";
  static const resendVerification = "${baseURL}email-verification/resend-verification";

  //User Profile URLs
  static const userProfile = "${baseURL}profile/me";
}
