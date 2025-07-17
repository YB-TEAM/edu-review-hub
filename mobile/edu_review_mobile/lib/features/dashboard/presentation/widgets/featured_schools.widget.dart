// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';

class FeaturedSchools extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final schools = [
      {
        'name': 'MIT',
        'location': 'Cambridge, MA',
        'rating': 4.8,
        'reviews': 1247,
        'image': 'https://download.logo.wine/logo/Massachusetts_Institute_of_Technology/Massachusetts_Institute_of_Technology-Logo.wine.png',
      },
      {
        'name': 'Stanford University',
        'location': 'Stanford, CA',
        'rating': 4.7,
        'reviews': 1156,
        'image': 'https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png',
      },
      {
        'name': 'Harvard University',
        'location': 'Cambridge, MA',
        'rating': 4.9,
        'reviews': 1432,
        'image': 'https://upload.wikimedia.org/wikipedia/commons/2/25/Harvard_University_shield.png',
      },
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Featured Universities',
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
          const SizedBox(height: 16),
          SizedBox(
            height: 100, 
            child: ListView.builder(
              clipBehavior: Clip.none, 
              scrollDirection: Axis.horizontal,
              itemCount: schools.length,
              padding: const EdgeInsets.only(right: 20),
              itemBuilder: (context, index) {
                final school = schools[index];
                return Padding(
                  padding: EdgeInsets.only(left: index == 0 ? 0 : 16),
                  child: _buildSchoolCard(
                    context: context,
                    name: school['name'] as String,
                    location: school['location'] as String,
                    rating: school['rating'] as double,
                    reviews: school['reviews'] as int,
                    image: school['image'] as String,
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSchoolCard({
    required BuildContext context,
    required String name,
    required String location,
    required double rating,
    required int reviews,
    required String image,
  }) {
    return Container(
      width: 280,
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {},
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                SizedBox(
                  width: 60,
                  height: 60,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(
                      image,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        name,
                        style: Theme.of(context).textTheme.titleSmall
                      ),
                      const SizedBox(height: 4),
                      Text(
                        location,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textGrey,
                        ),
                      ),
                      const SizedBox(height: 8),
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
                          const SizedBox(width: 8),
                          Text(
                            '(${reviews.toString()})',
                            style: Theme.of(context).textTheme.displayMedium?.copyWith(
                              color: AppColors.textGrey,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                  color: AppColors.textGrey,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
