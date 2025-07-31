import 'package:edu_review_mobile/features/auth/presentation/pages/verify_email.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/pages/profile.page.dart';
import 'package:edu_review_mobile/features/main_screen.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/pages/profile_detail.page.dart';
import 'package:flutter/services.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/auth/presentation/pages/sign_up.page.dart';
import 'package:edu_review_mobile/features/auth/presentation/pages/sign_in.page.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/pages/edit_profile.page.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteConstant.signIn:
        return MaterialPageRoute(
          settings: settings,
          builder:
              (_) => PopScope(
                canPop: false,
                onPopInvokedWithResult: (didPop, result) async {
                  if (!didPop) return;
                  SystemNavigator.pop();
                },
                child: const SignInPage(),
              ),
        );

      case RouteConstant.signUp:
        return MaterialPageRoute(
          settings: settings,
          builder:
              (_) => PopScope(
                canPop: false,
                onPopInvokedWithResult: (didPop, result) async {
                  if (!didPop) return;
                  SystemNavigator.pop();
                },
                child: const SignUpPage(),
              ),
        );

      case RouteConstant.mainScreen:
        return MaterialPageRoute(
          settings: settings,
          builder:
              (_) => PopScope(
                canPop: false,
                onPopInvokedWithResult: (didPop, result) async {
                  if (!didPop) return;
                  SystemNavigator.pop();
                },
                child: const MainScreen(),
              ),
        );

      case RouteConstant.profile:
        return MaterialPageRoute(
          settings: settings,
          builder:
              (_) => PopScope(
                canPop: false,
                onPopInvokedWithResult: (didPop, result) async {
                  if (!didPop) return;
                  SystemNavigator.pop();
                },
                child: const ProfilePage(),
              ),
        );

      case RouteConstant.detailProfile:
        final profileEntity = settings.arguments;
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => ProfileDetailPage(profileEntity: profileEntity),
        );

      case RouteConstant.editProfile:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const EditProfilePage(),
        );

      case RouteConstant.verifyEmail:
        final email = settings.arguments as String;
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => VerifyEmailScreen(email: email),
        );

      default:
        return MaterialPageRoute(
          settings: settings,
          builder:
              (_) => PopScope(
                canPop: false,
                child: Scaffold(
                  body: Center(
                    child: Text('No route defined for ${settings.name}'),
                  ),
                ),
              ),
        );
    }
  }
}
