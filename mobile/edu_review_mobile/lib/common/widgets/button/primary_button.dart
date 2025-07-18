import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PrimaryButton extends StatefulWidget {
  final VoidCallback onPressed;
  final String title;
  final Widget? icon;
  final Color? backgroundColor;
  final Color? textColor;
  const PrimaryButton({
    super.key,
    required this.onPressed,
    required this.title,
    this.icon,
    this.backgroundColor,
    this.textColor,
  });

  @override
  State<PrimaryButton> createState() => _PrimaryButtonState();
}

class _PrimaryButtonState extends State<PrimaryButton> {
  double _scale = 1.0;

  void _onTapDown(TapDownDetails details) {
    setState(() {
      _scale = 0.96;
    });
  }

  void _onTapUp(TapUpDetails details) {
    setState(() {
      _scale = 1.0;
    });
  }

  void _onTapCancel() {
    setState(() {
      _scale = 1.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ButtonStateCubit, ButtonState>(
      builder: (context, state) {
        final isLoading = state is ButtonLoadingState;
        return GestureDetector(
          onTapDown: isLoading ? null : _onTapDown,
          onTapUp: isLoading ? null : _onTapUp,
          onTapCancel: isLoading ? null : _onTapCancel,
          child: AnimatedScale(
            scale: _scale,
            duration: const Duration(milliseconds: 100),
            curve: Curves.easeInOut,
            child: isLoading ? _loading(context) : _initial(context),
          ),
        );
      },
    );
  }

  Widget _loading(BuildContext context) {
    return ElevatedButton(
      onPressed: null,
      style: ElevatedButton.styleFrom(
        backgroundColor: widget.backgroundColor ?? AppColors.primaryBlue,
        maximumSize: Size(double.infinity, 40),
        minimumSize: Size(double.infinity, 40),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      child: CircularProgressIndicator(
        color: widget.backgroundColor ?? AppColors.primaryBlue,
      ),
    );
  }

  Widget _initial(BuildContext context) {
    return ElevatedButton(
      onPressed: widget.onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: widget.backgroundColor ?? AppColors.primaryBlue,
        maximumSize: Size(double.infinity, 40),
        minimumSize: Size(double.infinity, 40),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      child:
          widget.icon == null
              ? Text(
                widget.title,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: widget.textColor ?? AppColors.textWhite,
                  fontWeight: FontWeight.w900,
                ),
              )
              : Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  widget.icon!,
                  const SizedBox(width: 8),
                  Text(
                    widget.title,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: widget.textColor ?? AppColors.textWhite,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
    );
  }
}
