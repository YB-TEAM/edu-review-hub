import 'package:edu_review_mobile/features/university/data/models/university_response.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/flutter_svg.dart';

class UniversityCard extends StatelessWidget {
  final UniversityResponse university;
  final VoidCallback? onTap;

  const UniversityCard({super.key, required this.university, this.onTap});

  @override
  Widget build(BuildContext context) {
    final String? imageUrl = university.bannerUrl ?? university.logoUrl ?? AppDefaultImages.defaultImage;

    return Container(
      height: 180,
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
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
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(
            fit: StackFit.expand,
            children: [
              if (imageUrl != null && imageUrl.isNotEmpty)
                Image.network(
                    imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[300]),
                )
              else
                Container(color: const Color(0xFFF0F2F5)),

              Container(color: Colors.black.withOpacity(0.6)),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Row(
                      children: [
                        if (university.isFeatured == true)
                          _buildTag(context, text: "Nổi bật", color: AppColors.amber700, icon: AppIcons.star),
                        if (university.isVerified == true)
                          _buildTag(context, text: "Tin cậy", color: AppColors.green400, icon: AppIcons.verified),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      university.name,
                      maxLines: 2,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w900,
                        color: AppColors.textWhite,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 6,
                      children: [
                        if (university.city != null || university.province != null)
                          buildInfoRow(
                            context: context,
                            text:
                                '${university.city ?? ''}${university.city != null && university.province != null ? ', ${university.province}' : ''}',
                            svgAssetPath: AppIcons.location,
                          ),
                        if (university.rankingNational != null)
                          buildInfoRow(
                            context: context,
                            text: '${university.rankingNational}',
                            svgAssetPath: AppIcons.rank,
                          ),
                        if (university.studentCount != null)
                          buildInfoRow(
                            context: context,
                            text: '${university.studentCount} sinh viên',
                            svgAssetPath: AppIcons.users,
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildInfoRow({
    required String text,
    required String svgAssetPath,
    Color textColor = AppColors.textWhite,
    double iconSize = 12,
    double spacing = 6,
    required BuildContext context,
  }) {
    if (text.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.primaryBlue,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SvgPicture.asset(
            svgAssetPath,
            height: iconSize,
            width: iconSize,
            color: textColor,
          ),
          SizedBox(width: spacing),
          Flexible(
            child: Text(
              text,
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                fontWeight: FontWeight.w900,
                color: AppColors.textWhite,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTag(BuildContext context, {required String text, required Color color, required String icon}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      margin: const EdgeInsets.only(right: 6),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          SvgPicture.asset(
            icon,
            height: 12,
            width: 12,
            color: AppColors.textWhite,
          ),
          const SizedBox(width: 6),
          Text(
            text,
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.w900,
              color: AppColors.textWhite,
            )
          ),
        ],
      ),
    );
  }
}
