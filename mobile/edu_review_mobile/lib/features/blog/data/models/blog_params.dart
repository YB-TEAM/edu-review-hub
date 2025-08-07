class BlogParams {
  final String title;
  final String content;
  final String? excerpt;
  final String? featuredImage;
  final String category;
  final List<int>? tagIds;

  BlogParams({
    required this.title,
    required this.content,
    this.excerpt,
    this.featuredImage,
    this.category = 'other',
    this.tagIds,
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'content': content,
      if (excerpt != null) 'excerpt': excerpt,
      if (featuredImage != null) 'featuredImage': featuredImage,
      'category': category,
      if (tagIds != null) 'tagIds': tagIds,
    };
  }
}
