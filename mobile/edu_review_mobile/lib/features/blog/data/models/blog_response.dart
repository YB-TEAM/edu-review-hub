class BlogResponse {
  final int id;
  final String title;
  final String content;
  final String? excerpt;
  final String featuredImage;
  final String featuredImageUrl;
  final Map<String, String>? featuredImageUrls;
  final String category;
  final String status;
  final String? moderationReason;
  final int viewCount;
  final int likeCount;
  final bool? isLiked;
  final int commentCount;
  final List<BlogTag> tags;
  final DateTime? publishedAt;
  final DateTime? moderatedAt;
  final int authorId;
  final String? authorName;
  final int? moderatorId;
  final String? moderatorName;
  final DateTime createdAt;
  final DateTime updatedAt;

  const BlogResponse({
    required this.id,
    required this.title,
    required this.content,
    this.excerpt,
    required this.featuredImage,
    required this.featuredImageUrl,
    this.featuredImageUrls,
    required this.category,
    required this.status,
    this.moderationReason,
    required this.viewCount,
    required this.likeCount,
    this.isLiked,
    required this.commentCount,
    required this.tags,
    this.publishedAt,
    this.moderatedAt,
    required this.authorId,
    this.authorName,
    this.moderatorId,
    this.moderatorName,
    required this.createdAt,
    required this.updatedAt,
  });

  factory BlogResponse.fromJson(Map<String, dynamic> json) {
    return BlogResponse(
      id: json['id'] ?? 0,
      title: json['title']?.toString() ?? '',
      content: json['content']?.toString() ?? '',
      excerpt: json['excerpt']?.toString(),
      featuredImage: json['featuredImage']?.toString() ?? '',
      featuredImageUrl: json['featuredImageUrl']?.toString() ?? '',
      featuredImageUrls: (json['featuredImageUrls'] as Map?)?.map(
        (key, value) => MapEntry(key.toString(), value.toString()),
      ),
      category: json['category']?.toString() ?? '',
      status: json['status']?.toString() ?? '',
      moderationReason: json['moderationReason']?.toString(),
      viewCount: json['viewCount'] ?? 0,
      likeCount: json['likeCount'] ?? 0,
      isLiked: json['isLiked'] as bool?,
      commentCount: json['commentCount'] ?? 0,
      tags: (json['tags'] as List<dynamic>?)
              ?.map((e) => BlogTag.fromJson(e))
              .toList() ??
          [],
      publishedAt: json['publishedAt'] != null
          ? DateTime.tryParse(json['publishedAt']) // avoid crash if format is wrong
          : null,
      moderatedAt: json['moderatedAt'] != null
          ? DateTime.tryParse(json['moderatedAt'])
          : null,
      authorId: json['authorId'] ?? 0,
      authorName: json['authorName']?.toString(),
      moderatorId: json['moderatorId'] as int?,
      moderatorName: json['moderatorName']?.toString(),
      createdAt: DateTime.tryParse(json['createdAt']) ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json['updatedAt']) ?? DateTime.now(),
    );
  }
}

class BlogTag {
  final int id;
  final String name;
  final String color;

  const BlogTag({
    required this.id,
    required this.name,
    required this.color,
  });

  factory BlogTag.fromJson(Map<String, dynamic> json) {
    return BlogTag(
      id: json['id'] ?? 0,
      name: json['name']?.toString() ?? '',
      color: json['color']?.toString() ?? '',
    );
  }


  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'color': color,
  };
}
