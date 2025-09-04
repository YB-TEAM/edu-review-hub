import 'package:edu_review_mobile/common/widgets/combobox/custom_combobox.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/models/criteria_response.dart';
import 'package:edu_review_mobile/core/services/get_criteria_service.dart';
import 'package:edu_review_mobile/features/university/presentation/widgets/criteria_card.widget.dart';
import 'package:edu_review_mobile/service_locator.dart';

class CriteriaSelector extends StatefulWidget {
  final ValueChanged<Map<int, double>> onChanged;

  const CriteriaSelector({
    Key? key,
    required this.onChanged,
  }) : super(key: key);

  @override
  State<CriteriaSelector> createState() => _CriteriaSelectorState();
}

class _CriteriaSelectorState extends State<CriteriaSelector> {
  final Map<int, double> _ratings = {};
  final List<CriteriaResponse> _selectedCriteria = [];

  List<CriteriaResponse> _allCriteria = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchCriteria();
  }

  Future<void> _fetchCriteria() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    final result = await sl<GetCriteriaApiService>().getCriterias();
    if (!mounted) return;
    result.fold(
      (failure) {
        setState(() {
          _error = failure.message;
          _isLoading = false;
        });
      },
      (criterias) {
        setState(() {
          _allCriteria = criterias;
          _isLoading = false;
        });
      },
    );
  }

  void _addCriteria(CriteriaResponse c) {
    if (_selectedCriteria.any((e) => e.id == c.id)) return;
    setState(() {
      _selectedCriteria.add(c);
      _ratings[c.id] = _ratings[c.id] ?? 1.0;
    });
    widget.onChanged(_ratings);
  }

  void _removeCriteria(int id) {
    setState(() {
      _selectedCriteria.removeWhere((e) => e.id == id);
      _ratings.remove(id);
    });
    widget.onChanged(_ratings);
  }


  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Column(
        children: [
          Text(_error!, style: const TextStyle(color: Colors.red)),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: _fetchCriteria,
            child: const Text("Thử lại"),
          )
        ],
      );
    }

    if (_allCriteria.isEmpty) {
      return const Text("Không có tiêu chí nào");
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomComboBox<CriteriaResponse>(
          label: "Chọn tiêu chí",
          placeholder: "Chọn một tiêu chí để đánh giá",
          value: null,
          items: _allCriteria,
          itemLabel: (c) => c.displayName,
          onChanged: (c) {
            if (c != null) _addCriteria(c);
          },
        ),

        const SizedBox(height: 16),

        Column(
          children: _selectedCriteria.map((c) {
            final currentRating = _ratings[c.id] ?? 1.0;

            return CriteriaCard(
              name: c.name,
              displayName: c.displayName,
              description: c.description,
              icon: c.icon,
              colorHex: c.color,
              maxScore: c.maxScore,
              currentRating: currentRating,
              onChanged: (value) {
                setState(() {
                  _ratings[c.id] = value;
                });
                widget.onChanged(_ratings);
              },
              onRemove: () => _removeCriteria(c.id),
            );
          }).toList(),
        )
      ],
    );
  }
}
