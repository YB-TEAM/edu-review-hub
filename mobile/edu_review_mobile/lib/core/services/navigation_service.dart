import 'package:flutter/material.dart';

class NavigationService {
  static final GlobalKey<ScaffoldMessengerState> messengerKey =
      GlobalKey<ScaffoldMessengerState>();

  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  static BuildContext? get currentContext => navigatorKey.currentContext;

  static void showErrorMessage(String message) {
    if (currentContext != null) {
      ScaffoldMessenger.of(currentContext!)
          .showSnackBar(SnackBar(content: Text(message)));
    }
  }

  static void showSuccessMessage(String message) {
    if (currentContext != null) {
      ScaffoldMessenger.of(currentContext!).showSnackBar(SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
      ));
    }
  }
}