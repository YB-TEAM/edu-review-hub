String formatNumber(int number) {
  if (number >= 1000000) {
    double value = number / 1000000;
    return '${value.toStringAsFixed(value.truncateToDouble() == value ? 0 : 1)}M';
  } else if (number >= 1000) {
    double value = number / 1000;
    return '${value.toStringAsFixed(value.truncateToDouble() == value ? 0 : 1)}K';
  } else {
    return number.toString();
  }
}
