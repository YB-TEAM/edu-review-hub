import 'package:edu_review_mobile/common/constants/app_default_images.constant.dart';
import 'package:edu_review_mobile/common/constants/app_icon.constant.dart';
import 'package:edu_review_mobile/common/widgets/button/custom_like_button.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';
import 'package:edu_review_mobile/core/utils/number_formatter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class ReviewCard extends StatelessWidget {
  final BuildContext context;
  final String user;
  final String university;
  final double rating;
  final String comment;
  final String time;
  final String avatar;
  final String imageUrl;
  final int likeCount;
  final int commentCount;
  final int shareCount;
  
  const ReviewCard({super.key, required this.context, required this.user, required this.university, required this.rating, required this.comment, required this.time, required this.avatar, required this.imageUrl, required this.likeCount, required this.commentCount, required this.shareCount});

  @override
  Widget build(BuildContext context) {
    return  Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.primaryWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.secondaryGrey,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
                child: Text(
                  avatar,
                  style: TextStyle(
                    color: AppColors.primaryBlue,
                    fontWeight: FontWeight.w700,
                    fontFamily: 'Roboto-Bold',
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(user, style: Theme.of(context).textTheme.displayLarge),
                        const SizedBox(width: 16),
                        Text(
                          "• $time",
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textGrey,
                          ),
                        ),
                      ]
                    ),
                    const SizedBox(height: 4),
                    Text(
                      university,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textGrey,
                          ),
                    ),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () {
                  print('Chia sẻ được bấm');
                },
                child: Icon(
                  Icons.more_horiz,
                  color: AppColors.primaryBlack,
                  size: 24,
                )
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            comment,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                  height: 1.5,
                ),
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.network(
              imageUrl,
              height: 160,
              width: double.infinity,
              fit: BoxFit.cover,
               errorBuilder: (context, error, stackTrace) {
                return Image.network(
                  AppDefaultImages.defaultImage,
                  height: 160,
                  width: double.infinity,
                  fit: BoxFit.cover,
                );
              },
            ),
            
          ),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Row(
              children: [
                CustomLikeButton(
                  likeCount: likeCount,
                  isLiked: false,
                  onTap: (isLiked) {},
                ),
                const SizedBox(width: 36),
                GestureDetector(
                  onTap: () {
                    print('Bình luận được bấm');
                  },
                  child: Row(
                    children: [
                      SvgPicture.asset(
                        AppIcons.comment,
                        width: 20,
                        height: 20,
                        color: AppColors.primaryGrey,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        formatNumber(commentCount),
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textGrey,
                            ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 36),
                GestureDetector(
                  onTap: () {
                    print('Chia sẻ được bấm');
                  },
                  child: Row(
                    children: [
                      SvgPicture.asset(
                        AppIcons.share,
                        width: 20,
                        height: 20,
                        color: AppColors.primaryGrey,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        formatNumber(shareCount),
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.textGrey,
                        ),
                      ),
                    ],
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