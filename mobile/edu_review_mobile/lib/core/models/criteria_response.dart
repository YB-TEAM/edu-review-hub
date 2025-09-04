class CriteriaResponse {
  final int id;
  final String name;
  final String displayName;
  final String description;
  final String type;
  final int weight;
  final int maxScore;
  final bool isActive;
  final bool isRequired;
  final int sortOrder;
  final String icon;
  final String color;

  CriteriaResponse({
    required this.id,
    required this.name,
    required this.displayName,
    required this.description,
    required this.type,
    required this.weight,
    required this.maxScore,
    required this.isActive,
    required this.isRequired,
    required this.sortOrder,
    required this.icon,
    required this.color,
  });

  factory CriteriaResponse.fromMap(Map<String, dynamic> map) {
    return CriteriaResponse(
      id: map['id'] as int,
      name: map['name'] as String,
      displayName: map['display_name'] as String,
      description: map['description'] as String,
      type: map['type'] as String,
      weight: map['weight'] as int,
      maxScore: map['max_score'] as int,
      isActive: map['is_active'] as bool,
      isRequired: map['is_required'] as bool,
      sortOrder: map['sort_order'] as int,
      icon: map['icon'] as String,
      color: map['color'] as String,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'display_name': displayName,
      'description': description,
      'type': type,
      'weight': weight,
      'max_score': maxScore,
      'is_active': isActive,
      'is_required': isRequired,
      'sort_order': sortOrder,
      'icon': icon,
      'color': color,
    };
  }
}
