import 'package:edu_review_mobile/common_libs.dart';

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

  IconData _getIcon(String? iconName) {
    switch (iconName) {
      case "star":
        return Icons.star_rounded;
      case "book":
        return Icons.menu_book_rounded;
      case "group":
        return Icons.group_rounded;
      case "lightbulb":
        return Icons.lightbulb_rounded;
      default:
        return Icons.help_outline_rounded;
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
                    child: Icon(
                      _getIcon(icon),
                      color: Colors.white,
                      size: 22,
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
