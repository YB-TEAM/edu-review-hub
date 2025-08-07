  import 'package:flutter/material.dart';

  class CustomDialog extends StatelessWidget {
    final String title;
    final String? content;
    final IconData? icon;
    final Color? iconColor;
    final List<Widget>? actions;
    final double borderRadius;
    final EdgeInsetsGeometry? contentPadding;
    final TextStyle? titleStyle;
    final TextStyle? contentStyle;
    final Color? backgroundColor;

    const CustomDialog({
      Key? key,
      required this.title,
      this.content,
      this.icon,
      this.iconColor,
      this.actions,
      this.borderRadius = 20,
      this.contentPadding,
      this.titleStyle,
      this.contentStyle,
      this.backgroundColor,
    }) : super(key: key);

    @override
    Widget build(BuildContext context) {
      return Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius),
        ),
        backgroundColor: backgroundColor ?? Colors.white,
        elevation: 0,
        child: Padding(
          padding: contentPadding ?? const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: (iconColor ?? Theme.of(context).primaryColor).withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    icon,
                    color: iconColor ?? Theme.of(context).primaryColor,
                    size: 40,
                  ),
                ),
              if (icon != null) const SizedBox(height: 16),
              Text(
                title,
                style: titleStyle ?? const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                ),
                textAlign: TextAlign.center,
              ),
              if (content != null) ...[
                const SizedBox(height: 16),
                Text(
                  content!,
                  style: contentStyle ?? const TextStyle(
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
              if (actions != null) ...[
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: actions!,
                ),
              ],
            ],
          ),
        ),
      );
    }
  }

  Future<T?> showAppDialog<T>({
    required BuildContext context,
    required String title,
    String? content,
    IconData? icon,
    Color? iconColor,
    List<Widget>? actions,
    double borderRadius = 20,
    EdgeInsetsGeometry? contentPadding,
    TextStyle? titleStyle,
    TextStyle? contentStyle,
    Color? backgroundColor,
  }) {
    return showDialog<T>(
      context: context,
      builder: (context) => CustomDialog(
        title: title,
        content: content,
        icon: icon,
        iconColor: iconColor,
        actions: actions,
        borderRadius: borderRadius,
        contentPadding: contentPadding,
        titleStyle: titleStyle,
        contentStyle: contentStyle,
        backgroundColor: backgroundColor,
      ),
    );
  } 