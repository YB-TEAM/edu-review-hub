import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter/material.dart';

class AccountInfoWidget extends StatelessWidget {
  final DateTime? birthday;
  final String? gender;
  final String? bio;
  final String? address;
  final String? country;
  final String? city;
  final String? universityName;
  final String? major;
  final String? studentId;
  final int? graduationYear;
  final bool isStudent;
  final String timeZone;
  final String language;

  const AccountInfoWidget({
    Key? key,
    this.birthday,
    this.gender,
    this.bio,
    this.address,
    this.country,
    this.city,
    this.universityName,
    this.major,
    this.studentId,
    this.graduationYear,
    required this.isStudent,
    required this.timeZone,
    required this.language,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.primaryWhite,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryBlack.withOpacity(0.25),
            blurRadius: 4,
            offset: const Offset(0, 2),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Details', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),

            if (birthday != null)
              _buildInfoRow(
                Icons.cake,
                'Birthday',
                '${birthday!.day}/${birthday!.month}/${birthday!.year}',
              ),
            if (gender != null && gender!.isNotEmpty)
              _buildInfoRow(Icons.person, 'Gender', gender!),
            if (bio != null && bio!.isNotEmpty)
              _buildInfoRow(Icons.info, 'Bio', bio!),
            if (address != null && address!.isNotEmpty)
              _buildInfoRow(Icons.location_on, 'Address', address!),
            if (country != null && country!.isNotEmpty)
              _buildInfoRow(Icons.public, 'Country', country!),
            if (city != null && city!.isNotEmpty)
              _buildInfoRow(Icons.location_city, 'City', city!),
            if (universityName != null && universityName!.isNotEmpty)
              _buildInfoRow(Icons.school, 'University', universityName!),
            if (major != null && major!.isNotEmpty)
              _buildInfoRow(Icons.book, 'Major', major!),
            if (studentId != null && studentId!.isNotEmpty)
              _buildInfoRow(Icons.badge, 'Student ID', studentId!),
            if (graduationYear != null)
              _buildInfoRow(
                Icons.school,
                'Graduation Year',
                graduationYear.toString(),
              ),
            _buildInfoRow(
              Icons.person_outline,
              'Student Status',
              isStudent ? 'Yes' : 'No',
            ),
            _buildInfoRow(Icons.access_time, 'Time Zone', timeZone),
            _buildInfoRow(Icons.language, 'Language', language),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, size: 20),
          const SizedBox(width: 8),
          Text('$label:', style: const TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(width: 8),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
