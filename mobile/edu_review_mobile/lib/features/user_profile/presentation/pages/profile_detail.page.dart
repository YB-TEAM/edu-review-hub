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
        title: const Text('Profile Details'),
        leading: BackButton(),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Text(
                profileEntity.displayName ?? '',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            if (profileEntity.bio != null && profileEntity.bio!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Text(
                    profileEntity.bio!,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      fontSize: 18,
                      color: AppColors.primaryBlack.withOpacity(0.8),
                      fontStyle: FontStyle.italic,
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],
            const SizedBox(height: 24),
            _buildDetailRow(
              'Birthday',
              profileEntity.birthday != null
                  ? '${profileEntity.birthday.day}/${profileEntity.birthday.month}/${profileEntity.birthday.year}'
                  : null,
            ),
            _buildDetailRow('Gender', profileEntity.gender),
            _buildDetailRow('Address', profileEntity.address),
            _buildDetailRow('Country', profileEntity.country),
            _buildDetailRow('City', profileEntity.city),
            _buildDetailRow('University', profileEntity.universityName),
            _buildDetailRow('Major', profileEntity.major),
            _buildDetailRow('Student ID', profileEntity.studentId),
            _buildDetailRow(
              'Graduation Year',
              profileEntity.graduationYear?.toString(),
            ),
            _buildDetailRow(
              'Is Student',
              profileEntity.isStudent != null
                  ? (profileEntity.isStudent ? 'Yes' : 'No')
                  : null,
            ),
            _buildDetailRow('Time Zone', profileEntity.timeZone),
            _buildDetailRow('Language', profileEntity.language),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String? value) {
    if (value == null || value.isEmpty) return SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label:',
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 16))),
        ],
      ),
    );
  }
}
