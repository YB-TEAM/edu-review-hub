// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ProfileDetailPage extends StatelessWidget {
  final dynamic profileEntity;
  const ProfileDetailPage({Key? key, required this.profileEntity})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Profile Details',
        onBackPressed: () => Navigator.of(context).maybePop(),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            // Personal Info
            Padding(
              padding: EdgeInsetsGeometry.all(16),
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
                  const SizedBox(height: 12),
                  _buildDetailInfoRow(
                    "assets/icons/ic_cake.svg",
                    'Birthday',
                    profileEntity.dateOfBirth,
                    context
                  ),
                  _buildDetailInfoRow(
                    "assets/icons/ic_gender.svg",
                    'Gender',
                    profileEntity.gender,
                    context
                  ),
                  _buildDetailInfoRow(
                    "assets/icons/ic_pin.svg",
                    'Address',
                    profileEntity.address,
                    context
                  ),
                  _buildDetailInfoRow(
                    "assets/icons/ic_globe.svg",
                    'Country',
                    profileEntity.country,
                    context
                  ),
                  _buildDetailInfoRow(
                    "assets/icons/ic_city.svg",
                    'City',
                    profileEntity.city,
                    context
                  ),
                ],
              ),
            ),
            PreferredSize(
              preferredSize: const Size.fromHeight(1),
              child: Container(height: 0.4, color: AppColors.secondaryGrey),
            ),
            // Education
            Padding(
              padding: EdgeInsetsGeometry.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Education',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.textBlack,
                      fontSize: 20,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _buildDetailInfoRow(
                    "assets/icons/ic_university.svg",
                    'University',
                    profileEntity.universityName,
                    context
                  ),
                  _buildDetailInfoRow(
                    "assets/icons/ic_book.svg",
                    'Major',
                    profileEntity.major,
                    context
                  ),
                  _buildDetailInfoRow(
                    "assets/icons/ic_card.svg",
                    'Student ID',
                    profileEntity.studentId,
                    context
                  ),
                  _buildDetailInfoRow(
                    "assets/icons/ic_calendar.svg",
                    'Graduation Year',
                    profileEntity.graduationYear?.toString(),
                    context
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailInfoRow(String icon, String label, String? value, BuildContext context) {
    if (value == null || value.isEmpty) return _buildEmptyInfoRow(icon, 'Add $label Information', context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: InkWell(
        onTap: () {
          print("hello");
        },
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
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
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
            SvgPicture.asset(
              'assets/icons/ic_pencil.svg',
              width: 20,
              height: 20,
              color: AppColors.primaryBlack,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyInfoRow(String icon, String content, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: InkWell(
        onTap: () {
          print("hello");
        },
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
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
              child: Text(
                content,
                style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: AppColors.textGrey,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
