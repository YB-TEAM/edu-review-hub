class TagResponse {
  final int id;
  final String name;
  final String? description;
  final String? color;
  final bool isActive;
  final int usageCount;
  final int bytes;
  final String createdAt;
  final String updatedAt;

  TagResponse({
    required this.id,
    required this.name,
    this.description,
    this.color,
    required this.isActive,
    required this.usageCount,
    required this.bytes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory TagResponse.fromMap(Map<String, dynamic> map) {
    return TagResponse(
      id: map['id'] ?? 0,
      name: map['name'] ?? '',
      description: map['description'],
      color: map['color'],
      isActive: map['isActive'] ?? false,
      usageCount: map['usageCount'] ?? 0,
      bytes: map['bytes'] ?? 0,
      createdAt: map['createdAt'] ?? '',
      updatedAt: map['updatedAt'] ?? '',
    );
  }
}
