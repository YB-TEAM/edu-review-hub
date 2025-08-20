import 'package:flutter/material.dart';
import 'package:edu_review_mobile/features/university/data/models/university_response.dart';
import 'package:edu_review_mobile/common_libs.dart';

class UniversityCard extends StatelessWidget {
  final UniversityResponse university;

  const UniversityCard({super.key, required this.university});

  @override
  Widget build(BuildContext context) {
    final String? imageUrl = AppDefaultImages.defaultImage;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            spreadRadius: 2,
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: () {
          debugPrint('Đã nhấn vào ${university.name}');
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Phần hình ảnh đầu thẻ
            if (imageUrl != null && imageUrl.isNotEmpty)
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                child: Image.network(
                  imageUrl,
                  height: 150,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      height: 150,
                      color: Colors.grey[200],
                      child: const Center(
                        child: Icon(Icons.school, size: 60, color: Colors.grey),
                      ),
                    );
                  },
                ),
              )
            else
              Container(
                height: 150,
                decoration: const BoxDecoration(
                  color: Color(0xFFF0F2F5),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                ),
                child: const Center(
                  child: Icon(Icons.apartment, size: 60, color: Colors.grey),
                ),
              ),

            // Phần nội dung chính
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Tên trường đại học
                  Text(
                    university.name,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF1E2749),
                        ),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),

                  // Địa điểm
                  _buildInfoRow(
                    context,
                    icon: Icons.location_on_outlined,
                    text:
                        '${university.city ?? ''}${university.city != null && university.province != null ? ', ' : ''}${university.province ?? ''}',
                  ),
                  const SizedBox(height: 8),

                  // Loại hình
                  if (university.type != null)
                    _buildInfoRow(
                      context,
                      icon: Icons.category_outlined,
                      text: 'Loại hình: ${university.type}',
                    ),
                  const SizedBox(height: 8),

                  // Xếp hạng Quốc gia
                  if (university.rankingNational != null)
                    _buildInfoRow(
                      context,
                      icon: Icons.trending_up,
                      text: 'Xếp hạng quốc gia: ${university.rankingNational}',
                    ),
                  ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Widget con để hiển thị một dòng thông tin với biểu tượng
  Widget _buildInfoRow(BuildContext context, {required IconData icon, required String text}) {
    if (text.isEmpty) return const SizedBox.shrink();
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.grey[600]),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey[700],
                ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}