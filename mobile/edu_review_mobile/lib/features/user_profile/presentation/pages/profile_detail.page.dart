import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';

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
                    Icons.cake_outlined,
                    'Birthday',
                    profileEntity.dateOfBirth,
                    context
                  ),
                  _buildDetailInfoRow(
                    Icons.wc_outlined,
                    'Gender',
                    profileEntity.gender,
                    context
                  ),
                  _buildDetailInfoRow(
                    Icons.location_on_outlined,
                    'Address',
                    profileEntity.address,
                    context
                  ),
                  _buildDetailInfoRow(
                    Icons.flag_outlined,
                    'Country',
                    profileEntity.country,
                    context
                  ),
                  _buildDetailInfoRow(
                    Icons.location_city_outlined,
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
                    Icons.school_outlined,
                    'University',
                    profileEntity.universityName,
                    context
                  ),
                  _buildDetailInfoRow(
                    Icons.book_outlined,
                    'Major',
                    profileEntity.major,
                    context
                  ),
                  _buildDetailInfoRow(
                    Icons.badge_outlined,
                    'Student ID',
                    profileEntity.studentId,
                    context
                  ),
                  _buildDetailInfoRow(
                    Icons.calendar_today_outlined,
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

  Widget _buildDetailInfoRow(IconData icon, String label, String? value, BuildContext context) {
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
        ],
      ),
    );
  }
}
