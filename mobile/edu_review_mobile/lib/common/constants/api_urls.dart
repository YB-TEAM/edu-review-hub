  class ApiUrls {
    static const baseURL = "https://edu-review-hub.onrender.com/api/v1/";
    // static const baseURL = "http://localhost:3000/api/v1/";
    //Authentication URLs
    static const register = "${baseURL}auth/register";
    static const login = "${baseURL}auth/login";
    static const refreshToken = "${baseURL}auth/refresh";
    static const logout = "${baseURL}auth/logout";

    //Email Verification URLs
    static const verifyEmail = "${baseURL}email-verification/verify-email";
    static const resendVerification = "${baseURL}email-verification/resend-verification";
    static const forgotPassword= "${baseURL}email-verification/forgot-password";
    static const resetPassword= "${baseURL}email-verification/reset-password";

    //User Profile URLs
    static const userProfile = "${baseURL}profile/me";

    //Blog URLs
    static const blogs = "${baseURL}blogs";
    static const getMyBlog = "${baseURL}blogs/my";
    static String blog(int id) => "${baseURL}blogs/$id";
    static String reactionBlog(int id) => "${baseURL}blogs/$id/like";
    static String publishBlog(int id) => "${baseURL}blogs/$id/publish";

    //University URLS
    static const getUniversities = "${baseURL}universities";
    static const reviews = "${baseURL}university-reviews";

    //Upload
    static const uploadImage = "${baseURL}upload/image";

    //Tag
    static const getTags = "${baseURL}tags";
  }
