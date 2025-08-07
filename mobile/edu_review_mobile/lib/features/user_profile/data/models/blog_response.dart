class BlogResponse {
  final int id;
  final String title;
  final String content;
  final String? excerpt;
  final String? featuredImage;
  final String? featuredImageUrl;
  final Map<String, String>? featuredImageUrls;
  final String category;
  final String status;
  final String? moderationReason;
  final int viewCount;
  final int likeCount;
  final bool? isLiked;
  final int commentCount;
  final List<BlogTag>? tags;
  final DateTime? publishedAt;
  final DateTime? moderatedAt;
  final int authorId;
  final String? authorName;
  final int? moderatorId;
  final String? moderatorName;
  final DateTime createdAt;
  final DateTime updatedAt;

  BlogResponse({
    required this.id,
    required this.title,
    required this.content,
    this.excerpt,
    this.featuredImage,
    this.featuredImageUrl,
    this.featuredImageUrls,
    required this.category,
    required this.status,
    this.moderationReason,
    required this.viewCount,
    required this.likeCount,
    this.isLiked,
    required this.commentCount,
    this.tags,
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
      id: json['id'],
      title: json['title'],
      content: json['content'],
      excerpt: json['excerpt'],
      featuredImage: json['featuredImage'],
      featuredImageUrl: json['featuredImageUrl'],
      featuredImageUrls: json['featuredImageUrls'] != null
          ? Map<String, String>.from(json['featuredImageUrls'])
          : null,
      category: json['category'],
      status: json['status'],
      moderationReason: json['moderationReason'],
      viewCount: json['viewCount'],
      likeCount: json['likeCount'],
      isLiked: json['isLiked'],
      commentCount: json['commentCount'],
      tags: json['tags'] != null
          ? (json['tags'] as List).map((e) => BlogTag.fromJson(e)).toList()
          : null,
      publishedAt: json['publishedAt'] != null
          ? DateTime.parse(json['publishedAt'])
          : null,
      moderatedAt: json['moderatedAt'] != null
          ? DateTime.parse(json['moderatedAt'])
          : null,
      authorId: json['authorId'],
      authorName: json['authorName'],
      moderatorId: json['moderatorId'],
      moderatorName: json['moderatorName'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
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
