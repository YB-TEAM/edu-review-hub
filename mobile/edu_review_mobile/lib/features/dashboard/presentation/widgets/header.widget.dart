import 'package:edu_review_mobile/common_libs.dart';
import 'search_input.widget.dart';

class HeaderWidget extends StatelessWidget {
  final VoidCallback? onTap;
  const HeaderWidget({Key? key, this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final double statusBarHeight = MediaQuery.of(context).padding.top;
    return Container(
      width: double.infinity,
      color: AppColors.primaryBlue,
      padding: EdgeInsets.only(
        top: statusBarHeight + 4,
        left: 0,
        right: 0,
        bottom: 4,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(width: 12),
          Expanded(child: SearchInputWidget(onTap: onTap)),
          const SizedBox(width: 12),
          IconButton(
            icon: const Icon(
              Icons.notifications_none_rounded,
              color: Colors.white,
              size: 28,
            ),
            onPressed: () {},
            splashRadius: 22,
          ),
          IconButton(
            icon: const Icon(
              Icons.chat_bubble_outline_rounded,
              color: Colors.white,
              size: 26,
            ),
            onPressed: () {},
            splashRadius: 22,
          ),
          const SizedBox(width: 8),
        ],
      ),
    );
  }
}
