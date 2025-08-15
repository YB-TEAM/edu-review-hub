class UniversityResponse {
  final int? id;
  final String? name;
  final String? shortName;
  final String? englishName;
  final List<String>? location;
  final String? description;
  final String? logoUrl;
  final int? averageRating;
  final int? reviewCount;
  final bool? isFeatured;
  final bool? isVerified;
  final String? status;
  final String? type;
  final String? createdAt;
  final String? updatedAt;

  UniversityResponse({
    this.id,
    this.name,
    this.shortName,
    this.englishName,
    this.location,
    this.description,
    this.logoUrl,
    this.averageRating,
    this.reviewCount,
    this.isFeatured,
    this.isVerified,
    this.status,
    this.type,
    this.createdAt,
    this.updatedAt,
  });

  factory UniversityResponse.fromJson(Map<String, dynamic> json) {
    return UniversityResponse(
      id: json['id'],
      name: json['name'],
      shortName: json['short_name'],
      englishName: json['english_name'],
      location: json['location'] != null
          ? List<String>.from(json['location'])
          : null,
      description: json['description'],
      logoUrl: json['logo_url'],
      averageRating: json['average_rating'],
      reviewCount: json['review_count'],
      isFeatured: json['is_featured'],
      isVerified: json['is_verified'],
      status: json['status'],
      type: json['type'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'short_name': shortName,
      'english_name': englishName,
      'location': location,
      'description': description,
      'logo_url': logoUrl,
      'average_rating': averageRating,
      'review_count': reviewCount,
      'is_featured': isFeatured,
      'is_verified': isVerified,
      'status': status,
      'type': type,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
