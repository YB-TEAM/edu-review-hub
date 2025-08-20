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
      'icon': AppIcons.cake,
      'label': 'Ngày sinh',
      'value': profileEntity.dateOfBirth,
    },
    {
      'icon': AppIcons.gender,
      'label': 'Giới tính',
      'value': profileEntity.gender,
    },
    {
      'icon': AppIcons.pin,
      'label': 'Địa chỉ',
      'value': profileEntity.address,
    },
    {
      'icon': AppIcons.globe,
      'label': 'Quốc gia',
      'value': profileEntity.country,
    },
    {
      'icon': AppIcons.city,
      'label': 'Thành phố',
      'value': profileEntity.city,
    },
  ];

  List<Map<String, String?>> get _educationItems => [
    {
      'icon': AppIcons.university,
      'label': 'Trường đại học',
      'value': profileEntity.universityName,
    },
    {
      'icon': AppIcons.book,
      'label': 'Ngành học',
      'value': profileEntity.major,
    },
    {
      'icon': AppIcons.card,
      'label': 'Mã số sinh viên',
      'value': profileEntity.studentId,
    },
    {
      'icon': AppIcons.calendar,
      'label': 'Năm tốt nghiệp',
      'value': profileEntity.graduationYear?.toString(),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Chi tiết hồ sơ',
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
                    'Thông tin cá nhân',
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
                    'Học vấn',
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
    if (value == null || value.isEmpty) return _buildEmptyInfoRow(icon, 'Thêm thông tin $label', context);
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
              AppIcons.pencil,
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
