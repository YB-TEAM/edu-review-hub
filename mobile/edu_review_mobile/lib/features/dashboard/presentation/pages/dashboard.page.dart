import 'package:flutter/material.dart';
import 'package:edu_review_mobile/core/config/theme/color.dart';
import '../widgets/animated_app_bar.widget.dart';
import '../widgets/hero_section.widget.dart';
import '../widgets/quick_stats.widget.dart';
import '../widgets/category_section.widget.dart';
import '../widgets/featured_schools.widget.dart';
import '../widgets/recent_reviews.widget.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late AnimationController _scaleController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  final ScrollController _scrollController = ScrollController();
  bool _showFloatingButton = false;

  @override
  void initState() {
    super.initState();

    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _slideController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _slideController, curve: Curves.easeOutCubic),
    );

    _fadeController.forward();
    Future.delayed(
      const Duration(milliseconds: 200),
      () => _slideController.forward(),
    );
    Future.delayed(
      const Duration(milliseconds: 400),
      () => _scaleController.forward(),
    );

    _scrollController.addListener(() {
      if (_scrollController.offset > 200 && !_showFloatingButton) {
        setState(() => _showFloatingButton = true);
      } else if (_scrollController.offset <= 200 && _showFloatingButton) {
        setState(() => _showFloatingButton = false);
      }
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    _scaleController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        backgroundColor: AppColors.backgroundGrey,
        body: CustomScrollView(
          controller: _scrollController,
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverPersistentHeader(
              delegate: AnimatedSliverAppBar(
                statusBarHeight: MediaQuery.of(context).padding.top,
                title: 'EduReview Hub',
                subtitle: 'Tìm hiểu & chia sẻ về các trường đại học',
                hintText: 'Tìm kiếm ...'
              ),
              pinned: true, 
            ),
            SliverToBoxAdapter(
              child: HeroSection(
                fadeAnimation: _fadeAnimation,
                slideAnimation: _slideAnimation,
              ),
            ),
            SliverToBoxAdapter(child: QuickStats()),
            SliverToBoxAdapter(child: CategorySection()),
            SliverToBoxAdapter(child: FeaturedSchools()),
            SliverToBoxAdapter(child: RecentReviews()),
            const SliverToBoxAdapter(child: SizedBox(height: 80)),
          ],
        ),
        floatingActionButton: AnimatedScale(
          scale: _showFloatingButton ? 1.0 : 0.0,
          duration: const Duration(milliseconds: 300),
          curve: Curves.elasticOut,
          child: FloatingActionButton.extended(
            onPressed: () {
              
            },
            backgroundColor: AppColors.primaryBlue,
            elevation: 8,
            icon: const Icon(Icons.add, color: Colors.white),
            label: const Text(
              'Thêm đánh giá',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontFamily: 'Roboto-SemiBold',
              ),
            ),
          ),
        ),
      ),
    );
  }
}
