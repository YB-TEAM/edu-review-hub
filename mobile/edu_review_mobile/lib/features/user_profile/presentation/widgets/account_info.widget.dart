// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common/widgets/button/custom_text_button.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/svg.dart';

class AccountInfoWidget extends StatelessWidget {
  final String? city;
  final String? universityName;
  final String? major;
  final int? graduationYear;
  final VoidCallback? onSeeMorePressed;

  const AccountInfoWidget({
    Key? key,
    this.city,
    this.universityName,
    this.major,
    this.graduationYear,
    this.onSeeMorePressed,
  }) : super(key: key);

  String _getGraduationStatus() {
    if (graduationYear == null) return 'Studying at';

    final currentYear = DateTime.now().year;
    if (graduationYear! < currentYear) {
      return 'Graduated from';
    } else if (graduationYear! == currentYear) {
      return 'Currently studying at';
    } else {
      return 'Studying at';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.primaryWhite,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Personal Information',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
                color: AppColors.textBlack,
                fontSize: 20,
              ),
            ),
            const SizedBox(height: 16),
            if (city != null && city!.isNotEmpty)
              _buildInfoRow("assets/icons/ic_city.svg", 'Lives in', city!, context),
            if (universityName != null && universityName!.isNotEmpty)
              _buildInfoRow("assets/icons/ic_university.svg", _getGraduationStatus(), universityName!, context),
            if (major != null && major!.isNotEmpty)
              _buildInfoRow("assets/icons/ic_book.svg", 'Majoring in', major!, context),
            SizedBox(
              width: double.infinity,
              child: CustomTextButton(
                onPressed: onSeeMorePressed,
                title: "See more",
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.textGrey,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String icon, String label, String value, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primaryBlue,
              borderRadius: BorderRadius.circular(8),
            ),
            child: SvgPicture.asset(
              icon,
              width: 24,
              height: 24,
              color: AppColors.primaryWhite,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: AppColors.textGrey,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.primaryBlack,
                    fontWeight: FontWeight.w600,
                    overflow: TextOverflow.ellipsis
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
