import 'package:intl/intl.dart';

String formatDate(String? dateString) {
  if (dateString == null || dateString.isEmpty) return '';
  try {
    final date = DateTime.parse(dateString).toLocal();
    // Map thứ trong tuần sang dạng Tn
    final weekdays = {
      DateTime.monday: 'T2',
      DateTime.tuesday: 'T3',
      DateTime.wednesday: 'T4',
      DateTime.thursday: 'T5',
      DateTime.friday: 'T6',
      DateTime.saturday: 'T7',
      DateTime.sunday: 'CN',
    };

    final weekday = weekdays[date.weekday] ?? '';
    final formattedDate = DateFormat('dd/MM/yyyy', 'vi_VN').format(date);
    return '$weekday, $formattedDate';
  } catch (e) {
    return '';
  }
}
