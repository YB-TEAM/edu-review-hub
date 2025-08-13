import 'package:edu_review_mobile/core/models/tag_response.dart';
import 'package:edu_review_mobile/core/services/get_tag_service.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter/material.dart';

class CustomTagMultiSelect extends StatefulWidget {
  final ValueChanged<List<int>> onTagsSelected; 
  final List<int>? initialTagIds;

  const CustomTagMultiSelect({
    super.key,
    required this.onTagsSelected,
    this.initialTagIds,
  });

  @override
  State<CustomTagMultiSelect> createState() => _CustomTagMultiSelectState();
}

class _CustomTagMultiSelectState extends State<CustomTagMultiSelect> {
  List<TagResponse> _tags = [];
  List<int> _selectedTagIds = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchTags();
  }

  Future<void> _fetchTags() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    final result = await sl<GetTagApiService>().getTags();
    result.fold(
      (failure) {
        setState(() {
          _error = failure.message;
          _isLoading = false;
        });
      },
      (tags) {
        setState(() {
          _tags = tags;
          _selectedTagIds = widget.initialTagIds ?? [];
          _isLoading = false;
        });
        widget.onTagsSelected(_selectedTagIds);
      },
    );
  }

  void _toggleTag(int tagId) {
    setState(() {
      if (_selectedTagIds.contains(tagId)) {
        _selectedTagIds.remove(tagId);
      } else {
        _selectedTagIds.add(tagId);
      }
    });
    widget.onTagsSelected(_selectedTagIds);
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
            onPressed: _fetchTags,
            child: const Text("Retry"),
          )
        ],
      );
    }

    if (_tags.isEmpty) {
      return const Text("No tags available");
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: _tags.map((tag) {
        final isSelected = _selectedTagIds.contains(tag.id);
        return ChoiceChip(
          label: Text(tag.name),
          selected: isSelected,
          onSelected: (_) => _toggleTag(tag.id),
          selectedColor: Colors.blue.shade100,
        );
      }).toList(),
    );
  }
}
