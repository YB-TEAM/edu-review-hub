// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common/widgets/button/custom_like_button.dart';
import 'package:edu_review_mobile/core/utils/number_formatter.dart';
import 'package:flutter/material.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';
import 'package:flutter_svg/flutter_svg.dart';

class RecentReviews extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final reviews = [
      {
        'user': 'Sarah M.',
        'university': 'MIT',
        'rating': 5.0,
        'comment': 'Amazing engineering program with world-class facilities!',
        'time': '2 hours ago',
        'avatar': 'S',
        'image': 'https://image-static.collegedunia.com/public/college_data/images/studyabroad/appImage/college_1090_29-15:00_o-HARVARD-UNIVERSITY-BUILDING-facebook.jpeg',
      },
      {
        'user': 'John D.',
        'university': 'Stanford University',
        'rating': 4.5,
        'comment': 'Great campus life and excellent professors.',
        'time': '5 hours ago',
        'avatar': 'J',
        'image': 'https://image-static.collegedunia.com/public/college_data/images/studyabroad/appImage/college_1090_29-15:00_o-HARVARD-UNIVERSITY-BUILDING-facebook.jpeg',
      },
      {
        'user': 'Emily R.',
        'university': 'Harvard University',
        'rating': 4.8,
        'comment': 'Outstanding academic environment and research opportunities.',
        'time': '1 day ago',
        'avatar': 'E',
        'image': 'https://image-static.collegedunia.com/public/college_data/images/studyabroad/appImage/college_1090_29-15:00_o-HARVARD-UNIVERSITY-BUILDING-facebook.jpeg',
      },
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 36),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Reviews',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontSize: 20),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'View All',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: AppColors.primaryBlue,
                      ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          ListView.builder(
            padding: EdgeInsets.zero,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: reviews.length,
            itemBuilder: (context, index) {
              final review = reviews[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                child: _buildReviewCard(
                  context: context,
                  user: review['user'] as String,
                  university: review['university'] as String,
                  rating: review['rating'] as double,
                  comment: review['comment'] as String,
                  time: review['time'] as String,
                  avatar: review['avatar'] as String,
                  imageUrl: review['image'] as String,
                  likeCount: 5200,
                  commentCount: 2200,
                  shareCount: 1300,
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildReviewCard({
    required BuildContext context,
    required String user,
    required String university,
    required double rating,
    required String comment,
    required String time,
    required String avatar,
    required String imageUrl,
    required int likeCount,
    required int commentCount,
    required int shareCount,
  }) {
    return Container(
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
                  print('Share tapped');
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
                    print('Comment tapped');
                  },
                  child: Row(
                    children: [
                      SvgPicture.asset(
                        'assets/icons/ic_comment.svg',
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
                    print('Share tapped');
                  },
                  child: Row(
                    children: [
                      SvgPicture.asset(
                        'assets/icons/ic_share.svg',
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
