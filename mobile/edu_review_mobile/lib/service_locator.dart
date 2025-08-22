import 'package:device_info_plus/device_info_plus.dart';
import 'package:edu_review_mobile/core/network/dio_client.dart';
import 'package:edu_review_mobile/core/services/get_tag_service.dart';
import 'package:edu_review_mobile/core/services/image_uploader_service.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/local/auth_local_service.dart';
import 'package:edu_review_mobile/features/auth/data/data_sources/remote/auth_api_service.dart';
import 'package:edu_review_mobile/features/auth/data/repository/auth_repository_imp.dart';
import 'package:edu_review_mobile/features/auth/domain/repository/auth_repository.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/forgot_password.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/resend_verification.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/reset_password.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/sign_in.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/verify_email.dart';
import 'package:edu_review_mobile/features/blog/data/data_sources/remote/blog_api_service.dart';
import 'package:edu_review_mobile/features/blog/data/repository/blog_repository_impl.dart';
import 'package:edu_review_mobile/features/blog/domain/repository/blog_repository.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/create_blog.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/get_blog.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/publish_blog.dart';
import 'package:edu_review_mobile/features/blog/domain/usecases/reaction_blog.dart';
import 'package:edu_review_mobile/features/settings/data/data_sources/remote/settings_api_service.dart';
import 'package:edu_review_mobile/features/settings/data/repository/settings_repository_impl.dart';
import 'package:edu_review_mobile/features/settings/domain/repository/settings_repository.dart';
import 'package:edu_review_mobile/features/university/data/data_sources/remote/university_api_service.dart';
import 'package:edu_review_mobile/features/university/data/repository/university_repository_impl.dart';
import 'package:edu_review_mobile/features/university/domain/repository/university_repository.dart';
import 'package:edu_review_mobile/features/university/domain/usecases/get_universities.dart';
import 'package:edu_review_mobile/features/user_profile/data/repository/profile_repository_impl.dart';
import 'package:edu_review_mobile/features/user_profile/domain/repository/profile_repository.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/delete_blog.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/edit_blog.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/get_blog.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/get_user.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/is_logged_in.dart';
import 'package:edu_review_mobile/features/settings/domain/usecases/logout.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/sign_up.dart';
import 'package:edu_review_mobile/features/settings/data/data_sources/local/settings_local_service.dart';
import 'package:edu_review_mobile/features/user_profile/data/data_souces/remote/profile_api_service.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/publish_blog.dart';
import 'package:get_it/get_it.dart';

final sl = GetIt.instance;

void setUpServiceLocator() {
  sl.registerSingleton<DioClient>(DioClient());

  // Tools & Plugins
  sl.registerSingleton<DeviceInfoPlugin>(DeviceInfoPlugin());

  // Services
  sl.registerSingleton<AuthApiService>(AuthApiServiceImpl());
  sl.registerSingleton<AuthLocalService>(AuthLocalServiceImpl());
  sl.registerSingleton<ProfileApiService>(ProfileApiServiceImpl());
  sl.registerSingleton<SettingsLocalService>(SettingsLocalServiceImpl());
  sl.registerSingleton<SettingsApiService>(SettingsApiServiceImpl());
  sl.registerSingleton<BlogApiService>(BlogApiServiceImpl());
  sl.registerSingleton<UniversityApiService>(UniversityApiServiceImpl());
  sl.registerLazySingleton<UploadImageApiService>(() => UploadImageApiServiceImpl());
  sl.registerLazySingleton<GetTagApiService>(() => GetTagApiServiceImpl());


  // Repositories
  sl.registerSingleton<AuthRepository>(AuthRepositoryImpl());
  sl.registerSingleton<ProfileRepository>(ProfileRepositoryImpl());
  sl.registerSingleton<SettingsRepository>(SettingsRepositoryImpl());
  sl.registerSingleton<BlogRepository>(BlogRepositoryImpl());
  sl.registerSingleton<UniversityRepository>(UniversityRepositoryImpl());

  // Usecases
  sl.registerSingleton<SignUpUseCase>(SignUpUseCase());
  sl.registerSingleton<SignInUseCase>(SignInUseCase());
  sl.registerSingleton<IsLoggedInUseCase>(IsLoggedInUseCase());
  sl.registerSingleton<VerifyEmailUseCase>(VerifyEmailUseCase());
  sl.registerSingleton<ResendVerificationUseCase>(ResendVerificationUseCase());
  sl.registerSingleton<ForgotPasswordUseCase>(ForgotPasswordUseCase());
  sl.registerSingleton<ResetPasswordUseCase>(ResetPasswordUseCase());


  sl.registerSingleton<GetUserUseCase>(GetUserUseCase());
  sl.registerSingleton<EditProfileUseCase>(EditProfileUseCase());
  sl.registerSingleton<LogOutUseCase>(LogOutUseCase());

  sl.registerSingleton<CreateBlogUseCase>(CreateBlogUseCase());
  sl.registerSingleton<GetMyBlogUseCase>(GetMyBlogUseCase());
  sl.registerSingleton<PublishBlogUseCase>(PublishBlogUseCase());
  sl.registerSingleton<UserPublishBlogUseCase>(UserPublishBlogUseCase());
  sl.registerSingleton<DeleteBlogUseCase>(DeleteBlogUseCase());
  sl.registerSingleton<EditBlogUseCase>(EditBlogUseCase());

  sl.registerSingleton<GetUniversityUseCase>(GetUniversityUseCase());
  sl.registerSingleton<GetBlogsUseCase>(GetBlogsUseCase());
  sl.registerSingleton<ReactionBlogUseCase>(ReactionBlogUseCase());
}
