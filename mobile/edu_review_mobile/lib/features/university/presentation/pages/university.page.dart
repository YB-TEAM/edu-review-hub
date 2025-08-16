import 'dart:io';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar_delegate.dart';
import 'package:edu_review_mobile/common/widgets/loading/custom_loading_indicator.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/university/presentation/bloc/get_university_cubit.dart';
import 'package:edu_review_mobile/features/university/presentation/bloc/get_university_state.dart';
import 'package:edu_review_mobile/features/university/presentation/widgets/university_card.widget.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class UniversityPage extends StatefulWidget {
  const UniversityPage({super.key});

  @override
  State<UniversityPage> createState() => _UniversityPageState();
}

class _UniversityPageState extends State<UniversityPage> {
  final RefreshController _refreshController = RefreshController();
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  bool _isRefreshing = false;
  List<dynamic> _filteredUniversities = [];
  List<dynamic> _universities = [];

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_filterUniversities);
  }

  @override
  void dispose() {
    _refreshController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onRefresh() async {
    setState(() => _isRefreshing = true);
    await context.read<UniversityCubit>().getUniversities();
    setState(() => _isRefreshing = false);
    _refreshController.refreshCompleted();
  }

  void _filterUniversities() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredUniversities = _universities.where((uni) {
        final nameLower = uni.name.toLowerCase();
        final locationLower = uni.location?.toLowerCase() ?? '';
        return nameLower.contains(query) || locationLower.contains(query);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final statusBarHeight = MediaQuery.of(context).padding.top;

    return BlocProvider(
      create: (_) => UniversityCubit()..getUniversities(),
      child: Scaffold(
        backgroundColor: AppColors.backgroundGrey,
        body: Stack(
          children: [
            BlocBuilder<UniversityCubit, UniversityState>(
              builder: (context, state) {
                if (state is UniversityLoading) {
                  return const Center(child: CustomLoadingIndicator());
                }
                if (state is UniversityLoaded) {
                  _universities = state.universities;
                  _filteredUniversities = _searchController.text.isEmpty
                      ? _universities
                      : _filteredUniversities;

                  return SmartRefresher(
                    controller: _refreshController,
                    onRefresh: _onRefresh,
                    header: null,
                    child: CustomScrollView(
                      controller: _scrollController,
                      physics: Platform.isIOS
                          ? const BouncingScrollPhysics()
                          : const ClampingScrollPhysics(),
                      slivers: [
                        SliverPersistentHeader(
                          pinned: true,
                          floating: false,
                          delegate: CustomAppBar(
                            statusBarHeight: statusBarHeight,
                            title: 'Khám phá trường đại học hàng đầu',
                            hintText: 'Tìm kiếm trường, địa điểm...',
                          ),
                        ),
                        _buildUniversityContent(),
                      ],
                    ),
                  );
                }
                if (state is UniversityError) {
                  return Center(child: Text(state.errorMessage));
                }
                return const SizedBox();
              },
            ),
            if (_isRefreshing)
              const Positioned(top: 16, left: 0, right: 0, child: SizedBox()),
          ],
        ),
      ),
    );
  }

  SliverList _buildUniversityContent() {
    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) {
          final university = _filteredUniversities[index];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: UniversityCard(
              name: university.name,
              location: university.location ?? '',
              imageUrl: university.imageUrl ?? '',
            ),
          );
        },
        childCount: _filteredUniversities.length,
      ),
    );
  }
}
