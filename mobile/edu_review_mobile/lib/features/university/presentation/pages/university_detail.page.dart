import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/features/university/data/models/university_response.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/university/presentation/widgets/review_card.widget.dart';
import 'package:flutter_svg/flutter_svg.dart';

class UniversityDetailPage extends StatelessWidget {
  final UniversityResponse university;
  const UniversityDetailPage({super.key, required this.university});

  @override
  Widget build(BuildContext context) {
    final imageUrl = university.bannerUrl ?? university.logoUrl ?? AppDefaultImages.defaultImage;
    return Scaffold(
      backgroundColor: AppColors.primaryWhite,
      appBar: CustomAppBar(
        title: university.shortName ?? university.name,
        showBackButton: true,
        onBackPressed: () => Navigator.of(context).pop(),
      ),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Column(
                children: [
                  if (imageUrl.isNotEmpty)
                    Container(
                      margin: const EdgeInsets.all(12),
                      height: 180,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        image: DecorationImage(
                          image: NetworkImage(imageUrl),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          university.name,
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.w900,
                            color: AppColors.textBlack,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            if (university.isFeatured == true)
                              _buildTag(context, text: "Nổi bật", color: AppColors.amber700, icon: AppIcons.star),
                            if (university.isVerified == true)
                              _buildTag(context, text: "Tin cậy", color: AppColors.green400, icon: AppIcons.verified),
                          ],
                        ),
                        const SizedBox(height: 16),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              if (university.city != null || university.province != null)
                                _buildInfoRow(
                                  context: context,
                                  text: '${university.city ?? ''}${university.city != null && university.province != null ? ', ${university.province}' : ''}',
                                  svgAssetPath: AppIcons.location,
                                ),
                              if (university.foundedYear != null)
                                _buildInfoRow(
                                  context: context,
                                  text: 'Thành lập: ${university.foundedYear}',
                                  svgAssetPath: AppIcons.calendar,
                                ),
                              if (university.type != null)
                                _buildInfoRow(
                                  context: context,
                                  text: 'Loại: ${university.type}',
                                  svgAssetPath: AppIcons.university,
                                ),
                              if (university.rankingNational != null)
                                _buildInfoRow(
                                  context: context,
                                  text: 'Xếp hạng quốc gia: ${university.rankingNational}',
                                  svgAssetPath: AppIcons.rank,
                                ),
                              if (university.rankingInternational != null)
                                _buildInfoRow(
                                  context: context,
                                  text: 'Xếp hạng quốc tế: ${university.rankingInternational}',
                                  svgAssetPath: AppIcons.rank,
                                ),
                              if (university.studentCount != null)
                                _buildInfoRow(
                                  context: context,
                                  text: '${university.studentCount} sinh viên',
                                  svgAssetPath: AppIcons.users,
                                ),
                              if (university.facultyCount != null)
                                _buildInfoRow(
                                  context: context,
                                  text: '${university.facultyCount} giảng viên',
                                  svgAssetPath: AppIcons.users,
                                ),
                              if (university.tuitionFeeMin != null && university.tuitionFeeMax != null)
                                _buildInfoRow(
                                  context: context,
                                  text: 'Học phí: ${university.tuitionFeeMin} - ${university.tuitionFeeMax} ${university.currency ?? ''}',
                                  svgAssetPath: AppIcons.users,
                                ),
                              if (university.address != null)
                                _buildInfoRow(
                                  context: context,
                                  text: 'Địa chỉ: ${university.address}',
                                  svgAssetPath: AppIcons.location,
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 18),
                        Divider(thickness: 1.2),
                        const SizedBox(height: 18),
                        Text(
                          'Giới thiệu',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          university.description ?? 'Chưa có thông tin giới thiệu.',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                        const SizedBox(height: 28),
                        Text(
                          'Đánh giá nổi bật',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 12),
                        _buildReviewsSection(context),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow({
    required String text,
    required String svgAssetPath,
    Color textColor = AppColors.textBlue,
    double iconSize = 18,
    double spacing = 8,
    required BuildContext context,
  }) {
    if (text.isEmpty) return const SizedBox.shrink();
    return Container(
      margin: const EdgeInsets.only(right: 10, bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.primaryWhite,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primaryBlack.withOpacity(0.1)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SvgPicture.asset(
            svgAssetPath,
            height: iconSize,
            width: iconSize,
            color: textColor.withOpacity(0.9),
          ),
          SizedBox(width: spacing + 2),
          Flexible(
            child: Text(
              text,
              style: Theme.of(context).textTheme.displayLarge?.copyWith(
                color: textColor,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTag(BuildContext context, {required String text, required Color color, required String icon}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      margin: const EdgeInsets.only(right: 8),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          SvgPicture.asset(
            icon,
            height: 16,
            width: 16,
            color: AppColors.textWhite,
          ),
          const SizedBox(width: 6),
          Text(
            text,
            style: Theme.of(context).textTheme.displayMedium?.copyWith(
              color: AppColors.textWhite,
            ),
          ),
        ],
      ),
    );
  }
}

Widget _buildReviewsSection(BuildContext context) {
    // TODO: Replace with real reviews from API
    final reviews = [
      {
        'user': 'Nguyễn Văn A',
        'university': 'RMIT',
        'rating': 4.5,
        'comment': 'Trường có môi trường học tập tốt, giảng viên nhiệt tình.',
        'time': '2 ngày trước',
        'avatar': 'A',
        'imageUrl': AppDefaultImages.defaultImage,
        'likeCount': 12,
        'commentCount': 3,
        'shareCount': 1,
      },
      {
        'user': 'Trần Thị B',
        'university': 'UIT',
        'rating': 4.0,
        'comment': 'Cơ sở vật chất hiện đại, nhiều hoạt động ngoại khóa.',
        'time': '1 tuần trước',
        'avatar': 'B',
        'imageUrl': AppDefaultImages.defaultImage,
        'likeCount': 8,
        'commentCount': 2,
        'shareCount': 0,
      },
      {
        'user': 'Lê Văn C',
        'university': 'MIT',
        'rating': 3.5,
        'comment': 'Chương trình học ổn nhưng cần cải thiện dịch vụ hỗ trợ sinh viên.',
        'time': '3 tuần trước',
        'avatar': 'C',
        'imageUrl': AppDefaultImages.defaultImage,
        'likeCount': 5,
        'commentCount': 1,
        'shareCount': 0,
      },
    ];
    return Column(
      children: reviews.map((review) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 18),
          child: ReviewCard(
            context: context,
            user: review['user'] as String,
            university: review['university'] as String,
            rating: review['rating'] as double,
            comment: review['comment'] as String,
            time: review['time'] as String,
            avatar: review['avatar'] as String,
            imageUrl: review['imageUrl'] as String,
            likeCount: review['likeCount'] as int,
            commentCount: review['commentCount'] as int,
            shareCount: review['shareCount'] as int,
          ),
        );
      }).toList(),
    );
  }
