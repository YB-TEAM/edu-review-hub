import 'package:edu_review_mobile/features/dashboard/presentation/pages/home.page.dart';
import 'package:flutter/services.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/auth/presentation/pages/sign_up.page.dart';
import 'package:edu_review_mobile/features/auth/presentation/pages/sign_in.page.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteConstant.signIn:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => PopScope(
            canPop: false,
            onPopInvokedWithResult: (didPop, result) async {
              if (!didPop) return;
              SystemNavigator.pop();
            },
            child: const SignInPage()),
          );

      case RouteConstant.signUp:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => PopScope(
            canPop: false,
            onPopInvokedWithResult: (didPop, result) async {
              if (!didPop) return;
              SystemNavigator.pop();
            },
            child: const SignUpPage()),
          );

      case RouteConstant.dashBoard:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => PopScope(
            canPop: false,
            onPopInvokedWithResult: (didPop, result) async {
              if (!didPop) return;
              SystemNavigator.pop();
            },
            child: const HomePage()),
          );

      default:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => PopScope(
            canPop: false,
            child: Scaffold(
              body:
                Center(child: Text('No route defined for ${settings.name}')),
            ),
          ),
        );
    }
  }
}
