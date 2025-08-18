import 'package:intl/intl.dart';

String formatDate(String? dateString) {
  if (dateString == null || dateString.isEmpty) return '';
  try {
    final date = DateTime.parse(dateString).toLocal();
    return 'T${DateFormat('M').format(date)} ${DateFormat('yyyy').format(date)}';
  } catch (e) {
    return '';
  }
}
