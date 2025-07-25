// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ProfileDetailPage extends StatelessWidget {
  final dynamic profileEntity;
  const ProfileDetailPage({Key? key, required this.profileEntity})
    : super(key: key);

  List<Map<String, String?>> get _personalInfoItems => [
    {
      'icon': 'assets/icons/ic_cake.svg',
      'label': 'Birthday',
      'value': profileEntity.dateOfBirth,
    },
    {
      'icon': 'assets/icons/ic_gender.svg',
      'label': 'Gender',
      'value': profileEntity.gender,
    },
    {
      'icon': 'assets/icons/ic_pin.svg',
      'label': 'Address',
      'value': profileEntity.address,
    },
    {
      'icon': 'assets/icons/ic_globe.svg',
      'label': 'Country',
      'value': profileEntity.country,
    },
    {
      'icon': 'assets/icons/ic_city.svg',
      'label': 'City',
      'value': profileEntity.city,
    },
  ];

  List<Map<String, String?>> get _educationItems => [
    {
      'icon': 'assets/icons/ic_university.svg',
      'label': 'University',
      'value': profileEntity.universityName,
    },
    {
      'icon': 'assets/icons/ic_book.svg',
      'label': 'Major',
      'value': profileEntity.major,
    },
    {
      'icon': 'assets/icons/ic_card.svg',
      'label': 'Student ID',
      'value': profileEntity.studentId,
    },
    {
      'icon': 'assets/icons/ic_calendar.svg',
      'label': 'Graduation Year',
      'value': profileEntity.graduationYear?.toString(),
    },
  ];

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
                  ..._personalInfoItems.map((item) => _buildDetailInfoRow(
                    item['icon']!,
                    item['label']!,
                    item['value'],
                    context,
                  )).toList(),
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
                  ..._educationItems.map((item) => _buildDetailInfoRow(
                    item['icon']!,
                    item['label']!,
                    item['value'],
                    context,
                  )).toList(),
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
                style: Theme.of(context).textTheme.labelMedium?.copyWith(
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
