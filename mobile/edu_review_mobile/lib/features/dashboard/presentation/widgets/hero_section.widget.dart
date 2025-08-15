// ignore_for_file: deprecated_member_use

import 'package:edu_review_mobile/common_libs.dart';
import 'dart:async';

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
  final List<String> quotes = [
    'The best way to predict the future is to create it.',
    'Life is 10% what happens to us and 90% how we react to it.',
    'Do not wait to strike till the iron is hot; but make it hot by striking.',
    'Success is not in what you have, but who you are.',
  ];

  final List<String> descriptions = [
    'Take control and shape your destiny.',
    'Your attitude determines your success.',
    'Act decisively to create opportunities.',
    'True success comes from character.',
  ];

  final List<String> authors = [
    'Peter Drucker',
    'Charles R. Swindoll',
    'William Butler Yeats',
    'Bo Bennett',
  ];

  int _quoteIndex = 0;
  int _circleIndex = 0;

  late Timer _timer;

  final List<List<Color>> gradients = [
    [AppColors.primaryBlue.withOpacity(0.85), AppColors.primaryGrey.withOpacity(0.8)],
    [AppColors.green600.withOpacity(0.8), AppColors.primaryGrey.withOpacity(0.7)],
    [AppColors.orange700.withOpacity(0.8), AppColors.orange400.withOpacity(0.7)],
    [AppColors.purple600.withOpacity(0.8), AppColors.primaryGrey.withOpacity(0.8)],
  ];

  final List<Offset> circlePositions = [
    Offset(-20, -20),
    Offset(260, -30),
    Offset(240, 100),
    Offset(-20, 100),
  ];
  final List<Offset> circlePositions2 = [
    Offset(260, 110),
    Offset(-30, 110),
    Offset(-30, -30),
    Offset(260, -30),
  ];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 2), (timer) {
      setState(() {
        _quoteIndex = (_quoteIndex + 1) % quotes.length;
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
            height: 210,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: gradients[_quoteIndex % gradients.length],
              ),
              boxShadow: [
                BoxShadow(
                  color: gradients[_quoteIndex % gradients.length][0].withOpacity(0.3),
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
                      // Quote
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 400),
                        transitionBuilder: (child, animation) =>
                            FadeTransition(opacity: animation, child: child),
                        child: Text(
                          quotes[_quoteIndex],
                          key: ValueKey<String>(quotes[_quoteIndex]),
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                color: AppColors.primaryWhite,
                                fontWeight: FontWeight.w900,
                              ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Description
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 400),
                        transitionBuilder: (child, animation) =>
                            FadeTransition(opacity: animation, child: child),
                        child: Text(
                          descriptions[_quoteIndex],
                          key: ValueKey<String>(descriptions[_quoteIndex]),
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppColors.primaryWhite.withOpacity(0.8),
                              ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Author
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 400),
                        transitionBuilder: (child, animation) =>
                            FadeTransition(opacity: animation, child: child),
                        child: Text(
                          '- ${authors[_quoteIndex]} -',
                          key: ValueKey<String>(authors[_quoteIndex]),
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: AppColors.primaryWhite,
                                fontWeight: FontWeight.w600,
                                fontStyle: FontStyle.italic,
                              ),
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
