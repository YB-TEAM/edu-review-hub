import 'package:edu_review_mobile/features/auth/presentation/pages/enter_pincode.page.dart';
import 'package:edu_review_mobile/features/auth/presentation/pages/forgot_password.page.dart';
import 'package:edu_review_mobile/features/auth/presentation/pages/verify_email.page.dart';
import 'package:edu_review_mobile/features/blog/presentation/pages/create_blog.page.dart';
import 'package:edu_review_mobile/features/university/presentation/pages/create_post.page.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/pages/my_blog_detail.page.dart';
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

      case RouteConstant.forgotPassword:
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => const ForgotPasswordPage(),
        );
      
       case RouteConstant.enterPincode:
        final args = settings.arguments as Map<String, dynamic>;
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => EnterPinCodePage(
            email: args['email'] as String,
            newPassword: args['newPassword'] as String,
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
      
      case RouteConstant.createBlog:
        return PageRouteBuilder(
          settings: settings,
          pageBuilder: (_, animation, secondaryAnimation) => CreateBlogPage(),
          transitionsBuilder: (_, animation, secondaryAnimation, child) {
            const begin = Offset(0.0, 1.0); 
            const end = Offset.zero;
            const curve = Curves.easeOutCubic;

            var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
            return SlideTransition(
              position: animation.drive(tween),
              child: child,
            );
          },
        );

      case RouteConstant.myBlogDetail:
        final blog = settings.arguments as BlogResponse;
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => MyBlogDetailPage(blog: blog),
        );  

      case RouteConstant.verifyEmail:
        final email = settings.arguments as String;
        return MaterialPageRoute(
          settings: settings,
          builder: (_) => VerifyEmailPage(email: email),
        );

      case RouteConstant.createPost:
        final universityId = settings.arguments as int;
        return PageRouteBuilder(
          settings: settings,
          pageBuilder: (_, animation, secondaryAnimation) => CreatePostPage(universityId: universityId),
          transitionsBuilder: (_, animation, secondaryAnimation, child) {
            const begin = Offset(0.0, 1.0); 
            const end = Offset.zero;
            const curve = Curves.easeOutCubic;

            var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
            return SlideTransition(
              position: animation.drive(tween),
              child: child,
            );
          },
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
