import 'package:edu_review_mobile/common_libs.dart';

class CustomComboBox<T> extends StatelessWidget {
  final String? label;
  final String placeholder;
  final T? value;
  final List<T> items;
  final String Function(T) itemLabel;
  final void Function(T?) onChanged;
  final String? Function(T?)? validator;

  const CustomComboBox({
    super.key,
    this.label,
    required this.placeholder,
    required this.value,
    required this.items,
    required this.itemLabel,
    required this.onChanged,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontFamily: 'Roboto-Bold',
              color: AppColors.textBlack,
            ),
          ),
          const SizedBox(height: 6),
        ],
        DropdownButtonFormField<T>(
          style: Theme.of(context).textTheme.bodyMedium,
          value: value,
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(color: AppColors.textGrey),
            filled: true,
            fillColor: AppColors.primaryWhite,
            contentPadding:
                const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(color: AppColors.secondaryGrey, width: 1.0),
              borderRadius: BorderRadius.circular(8.0),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2.0),
              borderRadius: BorderRadius.circular(8.0),
            ),
            errorBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: AppColors.primaryRed, width: 2.0),
              borderRadius: BorderRadius.circular(8.0),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: AppColors.primaryRed, width: 2.0),
              borderRadius: BorderRadius.circular(8.0),
            ),
          ),
          items: items
              .map(
                (e) => DropdownMenuItem<T>(
                  value: e,
                  child: Text(itemLabel(e)),
                ),
              )
              .toList(),
          onChanged: onChanged,
          validator: validator,
        ),
      ],
    );
  }
}
