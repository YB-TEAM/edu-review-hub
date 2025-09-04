import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CriteriaCard extends StatelessWidget {
  final String name;
  final String displayName;
  final String description;
  final String icon;
  final String colorHex;
  final int maxScore;
  final double currentRating;
  final ValueChanged<double> onChanged;
  final VoidCallback onRemove;

  const CriteriaCard({
    Key? key,
    required this.name,
    required this.displayName,
    required this.description,
    required this.icon,
    required this.colorHex,
    required this.maxScore,
    required this.currentRating,
    required this.onChanged,
    required this.onRemove,
  }) : super(key: key);

  String _getIcon(String? iconName) {
    switch (iconName) {
      case "graduation-cap":
        return AppIcons.university;
      case "book-open":
        return AppIcons.book;
      case "users":
        return AppIcons.users;
      case "building":
        return AppIcons.city;
      case "laptop":
        return AppIcons.science;
      case "home":
        return AppIcons.dorm;
      case "heart":
        return AppIcons.heart;
      case "globe":
        return AppIcons.globe;
      case "briefcase":
        return AppIcons.briefcase;
      case "handshake":
        return AppIcons.handshake;
      case "network-wired":
        return AppIcons.networkWired;
      case "star":
        return AppIcons.star;
      case "dollar-sign":
        return AppIcons.money;
      default:
        return AppIcons.unknow; 
    }
  }

  @override
  Widget build(BuildContext context) {
    final Color color = Color(int.parse(colorHex.replaceFirst('#', '0xff')));

    return Stack(
      children: [
        Container(
          margin: const EdgeInsets.symmetric(vertical: 10),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.primaryWhite,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: color, width: 1.5),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: color.withOpacity(0.9),
                    child: SvgPicture.asset(
                      _getIcon(icon),
                      width: 22,
                      height: 22,
                      colorFilter: const ColorFilter.mode(
                        Colors.white,
                        BlendMode.srcIn,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      displayName,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            color: color,
                          ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Mô tả
              Text(
                description,
                style: Theme.of(context).textTheme.labelSmall,
              ),
              const SizedBox(height: 14),

              // Slider
              SliderTheme(
                data: SliderTheme.of(context).copyWith(
                  activeTrackColor: color,
                  inactiveTrackColor: color.withOpacity(0.25),
                  thumbColor: color,
                  overlayColor: color.withOpacity(0.15),
                  thumbShape:
                      const RoundSliderThumbShape(enabledThumbRadius: 11),
                  trackHeight: 4.5,
                ),
                child: Slider(
                  activeColor: color,
                  value: currentRating,
                  min: 1,
                  max: maxScore.toDouble(),
                  divisions: maxScore - 1,
                  label: currentRating.toStringAsFixed(1),
                  onChanged: onChanged,
                ),
              ),

              Align(
                alignment: Alignment.centerRight,
                child: Text(
                  "Điểm: ${currentRating.toStringAsFixed(1)} / $maxScore",
                  style: Theme.of(context).textTheme.labelSmall,
                ),
              )
            ],
          ),
        ),

        Positioned(
          top: 6,
          right: -2,
          child: IconButton(
            icon: const Icon(
              Icons.close_sharp,
              color: Colors.redAccent,
              size: 20,
            ),
            onPressed: onRemove,
            splashRadius: 20,
          ),
        ),
      ],
    );
  }
}
