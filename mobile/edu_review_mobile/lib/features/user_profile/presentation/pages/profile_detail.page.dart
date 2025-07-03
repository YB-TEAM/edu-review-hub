import 'package:flutter/material.dart';
import 'package:edu_review_mobile/common_libs.dart';

class ProfileDetailPage extends StatelessWidget {
  final dynamic profileEntity;
  const ProfileDetailPage({Key? key, required this.profileEntity})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primaryWhite,
        scrolledUnderElevation: 0,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.chevron_left,
            size: 32,
            color: AppColors.primaryBlack,
          ),
          onPressed: () => Navigator.of(context).maybePop(),
          splashRadius: 24,
        ),
        title: const Text(
          'Profile Details',
          style: TextStyle(color: AppColors.textBlack),
        ),
        centerTitle: true,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: AppColors.secondaryGrey),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Personal Info
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
              Icons.cake_outlined,
              'Birthday',
              profileEntity.birthday != null
                  ? '${profileEntity.birthday.day}/${profileEntity.birthday.month}/${profileEntity.birthday.year}'
                  : null,
            ),
            _buildDetailInfoRow(
              Icons.wc_outlined,
              'Gender',
              profileEntity.gender,
            ),
            _buildDetailInfoRow(
              Icons.location_on_outlined,
              'Address',
              profileEntity.address,
            ),
            _buildDetailInfoRow(
              Icons.flag_outlined,
              'Country',
              profileEntity.country,
            ),
            _buildDetailInfoRow(
              Icons.location_city_outlined,
              'City',
              profileEntity.city,
            ),
            const SizedBox(height: 12),
            PreferredSize(
              preferredSize: const Size.fromHeight(1),
              child: Container(height: 1, color: AppColors.secondaryGrey),
            ),
            const SizedBox(height: 12),
            // Education
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
              Icons.school_outlined,
              'University',
              profileEntity.universityName,
            ),
            _buildDetailInfoRow(
              Icons.book_outlined,
              'Major',
              profileEntity.major,
            ),
            _buildDetailInfoRow(
              Icons.badge_outlined,
              'Student ID',
              profileEntity.studentId,
            ),
            _buildDetailInfoRow(
              Icons.calendar_today_outlined,
              'Graduation Year',
              profileEntity.graduationYear?.toString(),
            ),
            // Nếu cần, có thể thêm các trường khác ở đây
          ],
        ),
      ),
    );
  }

  Widget _buildDetailInfoRow(IconData icon, String label, String? value) {
    if (value == null || value.isEmpty) return SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primaryBlue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 24, color: AppColors.primaryBlue),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.primaryBlack.withOpacity(0.7),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.primaryBlack,
                    fontWeight: FontWeight.w600,
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
