import 'package:flutter/material.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';

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
      },
      {
        'user': 'John D.',
        'university': 'Stanford University',
        'rating': 4.5,
        'comment': 'Great campus life and excellent professors.',
        'time': '5 hours ago',
        'avatar': 'J',
      },
      {
        'user': 'Emily R.',
        'university': 'Harvard University',
        'rating': 4.8,
        'comment':
            'Outstanding academic environment and research opportunities.',
        'time': '1 day ago',
        'avatar': 'E',
      },
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 36),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Reviews',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontSize: 20
                ),
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
          ListView.builder(
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
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primaryWhite,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.textGrey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
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
                    Text(
                      user,
                      style: Theme.of(context).textTheme.displayLarge
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
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.star,
                        size: 16,
                        color: AppColors.primaryYellow,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        rating.toString(),
                        style: Theme.of(context).textTheme.displayMedium
                      ),
                    ],
                  ),
                  SizedBox(height: 4),
                  Text(
                    time,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textGrey,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            comment,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              height: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              IconButton(
                onPressed: () {},
                icon: Icon(
                  Icons.thumb_up_outlined,
                  size: 16,
                  color: AppColors.textGrey,
                ),
                constraints: const BoxConstraints(),
                padding: EdgeInsets.zero,
              ),
              const SizedBox(width: 8),
              Text(
                'Helpful',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppColors.textGrey,
                ),
              ),
              const SizedBox(width: 16),
              IconButton(
                onPressed: () {},
                icon: Icon(
                  Icons.comment_outlined,
                  size: 16,
                  color: AppColors.textGrey,
                ),
                constraints: const BoxConstraints(),
                padding: EdgeInsets.zero,
              ),
              const SizedBox(width: 8),
              Text(
                'Reply',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppColors.textGrey,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
