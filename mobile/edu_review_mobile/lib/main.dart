import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:edu_review_mobile/common_libs.dart';

void main() {
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    String initialRoute = RouteConstant.signIn;
    
    FlutterError.onError = (FlutterErrorDetails details) {
      // Filter out Navigator and MouseTracker assertion errors in debug mode
      if (kDebugMode &&
          (details.exception.toString().contains('mouse_tracker.dart') ||
              details.exception.toString().contains('!_debugLocked'))) {
        debugPrint('Framework assertion filtered: ${details.exception}');
        return;
      }

      FlutterError.presentError(details);
      Zone.current.handleUncaughtError(
          details.exception, details.stack ?? StackTrace.empty);
    };

    runApp(MyApp(
      initialRoute: initialRoute
    ));
  }, (error, stackTrace) {
    // // Avoid navigation in error handler to prevent loops
    // logError(error, stackTrace);

    // // Don't show dialog immediately, schedule it for next frame
    // if (!error.toString().contains('!_debugLocked') &&
    //     !error.toString().contains('mouse_tracker.dart')) {
    //   WidgetsBinding.instance.addPostFrameCallback((_) {
    //     _showErrorDialogSafely(error);
    //   });
    // }
  });
}

// void _showErrorDialogSafely(dynamic error) {
//   try {
//     final context = NavigationService.navigatorKey.currentContext;
//     if (context != null && ModalRoute.of(context)?.isCurrent == true) {
//       sl<DialogService>().showErrorDialog(
//           title: 'common.unknown_error_title'.tr,
//           message: 'common.unknown_error_message'.tr,
//           onDismiss: () {},
//           onExit: () {});
//     }
//   } catch (e) {
//     debugPrint('Failed to show error dialog: $e');
//   }
// }

// void logError(dynamic error, StackTrace stackTrace) {
//   debugPrint('ERROR: $error');
//   debugPrint('STACKTRACE: $stackTrace');
// }

class MyApp extends StatelessWidget {
  final String initialRoute;

  const MyApp({super.key, required this.initialRoute});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.lightTheme,
      initialRoute: RouteConstant.signIn,
      onGenerateRoute: AppRouter.generateRoute,
      debugShowCheckedModeBanner: false,
    );
  }
}

