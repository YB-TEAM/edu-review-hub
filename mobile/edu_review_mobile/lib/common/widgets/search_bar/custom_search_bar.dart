import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CustomSearchBar extends StatelessWidget {
  final double height;

  const CustomSearchBar({super.key, this.height = 56});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      child: TextField(
        decoration: InputDecoration(
          contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 0),
          prefixIcon: Padding(
            padding: const EdgeInsets.only(left: 12, right: 8),
            child: SvgPicture.asset(
              'assets/icons/ic_search.svg',
              width: 20,
              height: 20,
              colorFilter: const ColorFilter.mode(
                AppColors.primaryGrey,
                BlendMode.srcIn,
              ),
            ),
          ),
          prefixIconConstraints: const BoxConstraints(
            minWidth: 40,
            minHeight: 40,
          ),
          hintText: 'Search blogs, articles...',
          hintStyle: Theme.of(context)
              .textTheme
              .bodyMedium
              ?.copyWith(color: AppColors.textGrey),
          filled: true,
          fillColor: AppColors.primaryWhite,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }
}
