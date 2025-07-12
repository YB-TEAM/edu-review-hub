import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import '../../../../core/config/theme/typography.dart';

class UniversityCarouselWidget extends StatefulWidget {
  const UniversityCarouselWidget({super.key});

  @override
  State<UniversityCarouselWidget> createState() =>
      _UniversityCarouselWidgetState();
}

class _UniversityCarouselWidgetState extends State<UniversityCarouselWidget> {
  int _current = 0;

  final List<Map<String, String>> universities = [
    {
      'name': 'Đại học Bách Khoa',
      'image':
          'https://tuyensinhmut.edu.vn/wp-content/uploads/2022/08/truong-dai-hoc-bach-khoa-1.jpeg',
      'description':
          'Trường kỹ thuật hàng đầu Việt Nam, nổi bật về công nghệ và sáng tạo.',
    },
    {
      'name': 'Đại học Kinh tế Quốc dân',
      'image':
          'https://cdn-i.vtcnews.vn/upload/2025/01/03/screen-shot-2025-01-03-at-65403-pm-18545744.png',
      'description':
          'Trường đào tạo kinh tế, quản lý, tài chính hàng đầu cả nước.',
    },
    {
      'name': 'Đại học Công nghệ Thông tin',
      'image':
          'https://tuyensinh.uit.edu.vn/sites/default/files/uploads/files/dai-hoc-uit-3.jpg',
      'description': 'Chuyên sâu về CNTT, môi trường năng động, sáng tạo.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final textTheme = AppTypography.textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Featured Universities',
                style: textTheme.headlineMedium?.copyWith(
                  color: Colors.black87,
                  letterSpacing: 0.2,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                'Find your best fit and read trusted reviews.',
                style: textTheme.bodySmall?.copyWith(color: Colors.black54),
              ),
            ],
          ),
        ),
        CarouselSlider.builder(
          itemCount: universities.length,
          options: CarouselOptions(
            height: 150,
            autoPlay: true,
            autoPlayInterval: const Duration(seconds: 3),
            enlargeCenterPage: true,
            viewportFraction: 0.92,
            onPageChanged: (index, reason) {
              setState(() {
                _current = index;
              });
            },
          ),
          itemBuilder: (context, index, realIdx) {
            final uni = universities[index];
            return Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    image: DecorationImage(
                      image: NetworkImage(uni['image']!),
                      fit: BoxFit.cover,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 6,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                ),
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        Colors.black.withOpacity(0.65),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
                Positioned(
                  left: 16,
                  bottom: 18,
                  right: 16,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        uni['name']!,
                        style: textTheme.titleLarge?.copyWith(
                          color: Colors.white,
                          shadows: const [
                            Shadow(color: Colors.black54, blurRadius: 3),
                          ],
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        uni['description']!,
                        style: textTheme.bodySmall?.copyWith(
                          color: Colors.white70,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        height: 32,
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 0,
                            ),
                            minimumSize: const Size(0, 32),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(6),
                            ),
                            elevation: 1,
                          ),
                          child: Text(
                            'Details',
                            style: textTheme.labelSmall?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children:
              universities.asMap().entries.map((entry) {
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  width: _current == entry.key ? 16.0 : 7.0,
                  height: 7.0,
                  margin: const EdgeInsets.symmetric(
                    vertical: 8.0,
                    horizontal: 3.0,
                  ),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(6),
                    color:
                        _current == entry.key
                            ? Colors.orange
                            : Colors.grey[300],
                  ),
                );
              }).toList(),
        ),
      ],
    );
  }
}
