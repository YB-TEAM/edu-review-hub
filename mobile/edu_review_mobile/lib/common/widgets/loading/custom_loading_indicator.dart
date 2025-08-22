import 'package:edu_review_mobile/common_libs.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

class CustomLoadingIndicator extends StatelessWidget {
  const CustomLoadingIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return LoadingAnimationWidget.bouncingBall(
      color: AppColors.primaryBlue,
      size: 100,
    );
  }
}
