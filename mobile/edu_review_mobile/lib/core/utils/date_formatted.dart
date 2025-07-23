import 'package:intl/intl.dart';

String formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return '';
    try {
      final date = DateTime.parse(dateString).toLocal();
      return DateFormat('MMM yyyy').format(date); // e.g., Jul 2025
    } catch (e) {
      return '';
    }
  }