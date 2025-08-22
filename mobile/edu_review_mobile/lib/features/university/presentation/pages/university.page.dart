import 'dart:io';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar_delegate.dart';
import 'package:edu_review_mobile/features/university/presentation/bloc/get_university_cubit.dart';
import 'package:edu_review_mobile/features/university/presentation/bloc/get_university_state.dart';
import 'package:edu_review_mobile/features/university/presentation/widgets/university_card.widget.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class UniversityPage extends StatelessWidget {
  const UniversityPage({super.key});

  @override
  Widget build(BuildContext context) {
    final statusBarHeight = MediaQuery.of(context).padding.top;
    final ScrollController _scrollController = ScrollController();

    return BlocProvider(
      create: (_) => UniversityCubit()..fetchUniversities(),
      child: Builder(
        builder: (context) {
          _scrollController.addListener(() {
            final cubit = context.read<UniversityCubit>();
            final state = cubit.state;

            if (state is UniversityLoaded &&
                !state.hasReachedEnd && 
                _scrollController.position.pixels >=
                    _scrollController.position.maxScrollExtent) {
              cubit.loadMoreUniversities(state.pagination);
            }
          });
          return BlocListener<UniversityCubit, UniversityState>(
            listener: (context, state) {
              if (state is UniversityError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Lỗi: ${state.errorMessage}')),
                );
              }
            },
            child: Scaffold(
              backgroundColor: AppColors.primaryWhite,
              body: CustomScrollView(
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
                      title: 'Khám phá các trường đại học',
                      hintText: 'Tìm kiếm trường đại học...',
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: BlocBuilder<UniversityCubit, UniversityState>(
                      builder: (context, state) {
                        if (state is UniversityLoading) {
                          return const Center(
                            child: Padding(
                              padding: EdgeInsets.all(20),
                              child: CircularProgressIndicator(),
                            ),
                          );
                        } else if (state is UniversityLoaded) {
                          final universities = state.universities;
                          return Padding(
                            padding: EdgeInsetsGeometry.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ...universities.map(
                                  (university) =>
                                      UniversityCard(university: university),
                                ),
                                const SizedBox(height: 30),
                              ],
                            ),
                          );
                        } else if (state is UniversityError) {
                          return Padding(
                            padding: const EdgeInsets.all(16),
                            child: Text(
                              'Lỗi: ${state.errorMessage}',
                              style: const TextStyle(color: Colors.red),
                            ),
                          );
                        }
                        return const SizedBox.shrink();
                      },
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
