import 'package:edu_review_mobile/core/config/theme/color.dart';
import 'package:flutter/material.dart';
import 'package:like_button/like_button.dart';
import 'package:edu_review_mobile/core/utils/number_formatter.dart';

class CustomLikeButton extends StatefulWidget {
  final int likeCount;
  final bool isLiked;
  final ValueChanged<bool>? onTap;

  const CustomLikeButton({
    super.key,
    required this.likeCount,
    required this.isLiked,
    this.onTap,
  });

  @override
  State<CustomLikeButton> createState() => _CustomLikeButtonState();
}

class _CustomLikeButtonState extends State<CustomLikeButton> {
  late int _likeCount;
  late bool _isLiked;

  @override
  void initState() {
    super.initState();
    _likeCount = widget.likeCount;
    _isLiked = widget.isLiked;
  }

  @override
  Widget build(BuildContext context) {
    final textStyle = Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: AppColors.textGrey,
        );

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        LikeButton(
          size: 20,
          isLiked: _isLiked,
          likeBuilder: (bool isLiked) {
            return Icon(
              isLiked ? Icons.favorite : Icons.favorite_border,
              color: isLiked ? Colors.red : Colors.grey,
              size: 20,
            );
          },
          onTap: (bool isLiked) async {
            final newIsLiked = !isLiked;
            setState(() {
              _isLiked = newIsLiked;
              _likeCount += newIsLiked ? 1 : -1;
            });
            widget.onTap?.call(newIsLiked);
            return newIsLiked;
          },
        ),
        Text(
          formatNumber(_likeCount),
          style: textStyle,
        ),
      ],
    );
  }
}
