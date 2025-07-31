  import 'package:edu_review_mobile/core/config/theme/color.dart';
  import 'package:flutter/material.dart';
  import 'package:flutter/services.dart';
  import 'package:flutter_svg/svg.dart';
  import 'package:material_floating_search_bar_2/material_floating_search_bar_2.dart';

  class CustomSearchBar extends StatefulWidget {
    final bool isPortrait;

    const CustomSearchBar({Key? key, required this.isPortrait}) : super(key: key);

    @override
    State<CustomSearchBar> createState() => _CustomSearchBarState();
  }

  class _CustomSearchBarState extends State<CustomSearchBar> {
    final FloatingSearchBarController _controller = FloatingSearchBarController();
    final List<Map<String, String>> suggestions = [
      {
        'title': 'ĐH Bách Khoa HN',
        'subtitle': 'Cơ sở vật chất cực xịn',
        'icon': 'assets/icons/ic_star_active.svg',
      },
      {
        'title': 'ĐH Kinh Tế TP.HCM',
        'subtitle': 'Đời sống sinh viên năng động',
        'icon': 'assets/icons/ic_city.svg',
      },
      {
        'title': 'ĐH Đà Lạt',
        'subtitle': 'View đẹp như Đà Lạt thu nhỏ',
        'icon': 'assets/icons/ic_book.svg',
      },
      {
        'title': 'ĐH Quốc Gia HN',
        'subtitle': 'Trường đại học hàng đầu Việt Nam',
        'icon': 'assets/icons/ic_university.svg',
      },
      {
        'title': 'ĐH Sư Phạm Kỹ Thuật HCM',
        'subtitle': 'Chất lượng đào tạo kỹ thuật cao',
        'icon': 'assets/icons/ic_book.svg',
      },
      {
        'title': 'ĐH Ngoại Thương',
        'subtitle': 'Chuyên ngành kinh tế quốc tế',
        'icon': 'assets/icons/ic_book.svg',
      },
      {
        'title': 'ĐH Y Dược TP.HCM',
        'subtitle': 'Chất lượng đào tạo y khoa hàng đầu',
        'icon': 'assets/icons/ic_book.svg',
      },
      {
        'title': 'ĐH Kiến Trúc HN',
        'subtitle': 'Kiến trúc sư tương lai',
        'icon': 'assets/icons/ic_book.svg',
      },
    ];

    @override
    Widget build(BuildContext context) {
      
      return FloatingSearchBar(
        margins: EdgeInsets.only(left: 12, right: 12, top: MediaQuery.of(context).padding.top + 12, bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        height: 52,
        controller: _controller,
        hint: 'Search blogs, news, etc.',
        hintStyle: Theme.of(context).textTheme.labelMedium?.copyWith(color: AppColors.textGrey, fontWeight: FontWeight.w500),
        queryStyle: Theme.of(context).textTheme.labelMedium?.copyWith(color: AppColors.textBlack, fontWeight: FontWeight.w500),
        iconColor: AppColors.textGrey,
        transitionDuration: const Duration(milliseconds: 800),
        transitionCurve: Curves.easeInOutCubic,
        physics: const BouncingScrollPhysics(),
        axisAlignment: widget.isPortrait ? 0.0 : -1.0,
        openAxisAlignment: 0.0,
        leadingActions: [
          FloatingSearchBarAction(
            showIfClosed: false,
            showIfOpened: true,
            child: GestureDetector(
              onTap: () {
                _controller.close(); 
                FocusScope.of(context).unfocus(); 
              },
              child: Icon(
                Icons.chevron_left,
                color: AppColors.primaryGrey,
                size: 28,
              ),
            ),
          ),
          FloatingSearchBarAction(
            showIfClosed: true,
            child: Padding(
              padding: const EdgeInsets.only(right: 4),
              child: SvgPicture.asset(
                'assets/icons/ic_university.svg',
                width: 24,
                height: 24,
                colorFilter: const ColorFilter.mode(
                  AppColors.primaryGrey,
                  BlendMode.srcIn,
                ),
              ),
            ),
          ),
        ],
        actions: [
          FloatingSearchBarAction.searchToClear(showIfClosed: false),
        ],
        onQueryChanged: (query) {
          
        },
        onKeyEvent: (KeyEvent keyEvent) {
          if (keyEvent.logicalKey == LogicalKeyboardKey.escape) {
            _controller.query = '';
            _controller.close();
          }
        },
        scrollPadding: EdgeInsets.zero,
        transition: CircularFloatingSearchBarTransition(spacing: 16),
        builder: (context, transition) => _buildSuggestionList(),
      );
    }

    Widget _buildSuggestionList() {
      return Material(
        borderRadius: BorderRadius.circular(8),
        color: Colors.white,
        child: ListView.separated(
          shrinkWrap: true,
          padding: EdgeInsets.zero,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: suggestions.length,
          separatorBuilder: (_, __) => Divider(height: 0, thickness: 1, indent: 32, endIndent: 32, color: AppColors.primaryBlack.withOpacity(0.1)),
          itemBuilder: (context, index) {
            final item = suggestions[index];
            return InkWell(
              onTap: () {
                _controller.close();
              },
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    SvgPicture.asset(
                      item['icon'] ?? 'assets/icons/ic_search.svg',
                      width: 28,
                      height: 28,
                      colorFilter: ColorFilter.mode(AppColors.primaryGrey, BlendMode.srcIn),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item['title'] ?? '', style: Theme.of(context).textTheme.titleMedium),
                          Text(
                            item['subtitle'] ?? '',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textGrey),
                          ),
                        ],
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
