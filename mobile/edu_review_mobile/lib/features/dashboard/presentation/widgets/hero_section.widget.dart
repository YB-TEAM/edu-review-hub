// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common_libs.dart';
import 'dart:async';

import 'package:flutter_svg/svg.dart';


class HeroSection extends StatefulWidget {
  final Animation<double> fadeAnimation;
  final Animation<Offset> slideAnimation;

  const HeroSection({
    Key? key,
    required this.fadeAnimation,
    required this.slideAnimation,
  }) : super(key: key);

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection> with SingleTickerProviderStateMixin {
  final List<String> titles = [
    'Shape Your Tomorrow',
    'Find Your Spark',
    'Design Your Vision',
    "Step Into Possibility",
  ];
  final List<String> descriptions = [
    'Let real student stories guide you to the right university fit.',
    'Let lived journeys illuminate the path meant for you.',
    'Let unique insights take you to new possibilities.',
    'Let authentic journeys shape your next decision.',
  ];
  int _colorIndex = 0;
  int _circleIndex = 0;
  late Timer _timer;

  final List<List<Color>> gradients = [
    [AppColors.primaryBlue.withOpacity(0.85), AppColors.primaryGrey.withOpacity(0.8)],
    [AppColors.green600.withOpacity(0.8), AppColors.primaryGrey.withOpacity(0.7)],
    [AppColors.orange700.withOpacity(0.8), AppColors.orange400.withOpacity(0.7)],
    [AppColors.purple600.withOpacity(0.8), AppColors.primaryGrey.withOpacity(0.8)],
  ];

  final List<Offset> circlePositions = [
    Offset(-20, -20), // topLeft
    Offset(260, -30), // topRight 
    Offset(240, 100),  // bottomRight
    Offset(-20, 100),  // bottomLeft 
  ];
  final List<Offset> circlePositions2 = [
    Offset(260, 110), // bottomRight
    Offset(-30, 110), // bottomLeft
    Offset(-30, -30), // topLeft
    Offset(260, -30), // topRight
  ];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      setState(() {
        _colorIndex = (_colorIndex + 1) % gradients.length;
        _circleIndex = (_circleIndex + 1) % 4;
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(left: 12, right: 12, top: 12, bottom: 32),
      child: SlideTransition(
        position: widget.slideAnimation,
        child: FadeTransition(
          opacity: widget.fadeAnimation,
          child: Container(
            height: 184,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: gradients[_colorIndex],
              ),
              boxShadow: [
                BoxShadow(
                  color: gradients[_colorIndex][0].withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Stack(
              children: [
                AnimatedPositioned(
                  duration: const Duration(milliseconds: 800),
                  left: circlePositions[_circleIndex].dx,
                  top: circlePositions[_circleIndex].dy,
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      color: AppColors.primaryWhite.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
                AnimatedPositioned(
                  duration: const Duration(milliseconds: 800),
                  left: circlePositions2[_circleIndex].dx,
                  top: circlePositions2[_circleIndex].dy,
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: AppColors.primaryWhite.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 400),
                        transitionBuilder: (Widget child, Animation<double> animation) {
                          return FadeTransition(opacity: animation, child: child);
                        },
                        child: Text(
                          titles[_colorIndex],
                          key: ValueKey<String>(titles[_colorIndex]),
                          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                            color: AppColors.primaryWhite,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 400),
                        transitionBuilder: (Widget child, Animation<double> animation) {
                          return FadeTransition(opacity: animation, child: child);
                        },
                        child: Text(
                          descriptions[_colorIndex],
                          key: ValueKey<String>(descriptions[_colorIndex]),
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.primaryWhite.withOpacity(0.8),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primaryWhite.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            SvgPicture.asset(AppIcons.search, width: 16, height: 16, color: AppColors.primaryWhite),
                            const SizedBox(width: 8),
                            Text(
                              'Search Universities',
                              style: Theme.of(context).textTheme.displayMedium?.copyWith(
                                color: AppColors.primaryWhite,
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
          ),
        ),
      ),
    );
  }
}
