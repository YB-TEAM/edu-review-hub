import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter/material.dart';

class AccountInfoWidget extends StatelessWidget {
  final String email;
  final String? phoneNumber;
  final String? birthday;
  final String? gender;

  const AccountInfoWidget({
    Key? key,
    required this.email,
    this.phoneNumber,
    this.birthday,
    this.gender,
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
            _buildInfoRow(Icons.email, 'Email', email),
            if (phoneNumber != null && phoneNumber!.isNotEmpty)
              _buildInfoRow(Icons.phone, 'Phone Number', phoneNumber!),
            if (birthday != null && birthday!.isNotEmpty)
              _buildInfoRow(Icons.cake, 'Birthday', birthday!),
            if (gender != null && gender!.isNotEmpty)
              _buildInfoRow(Icons.person, 'Gender', gender!),
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
