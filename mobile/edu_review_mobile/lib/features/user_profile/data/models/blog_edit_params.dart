class EditBlogParams {
  final int blogId;
  final String? title;
  final String? content;
  final String? excerpt;
  final String? featuredImage;
  final String? category;
  final String? status;
  final List<int>? tagIds;

  EditBlogParams({
    required this.blogId,
    this.title,
    this.content,
    this.excerpt,
    this.featuredImage,
    this.status = 'draft',
    this.category = 'other',
    this.tagIds,
  });

  Map<String, dynamic> toJson() {
    return {
      'blogId': blogId,
      if(title != null) 'title': title,
      if(content != null)'content': content,
      if (excerpt != null) 'excerpt': excerpt,
      if (featuredImage != null) 'featuredImage': featuredImage,
      'status': status,
      'category': category,
      if (tagIds != null) 'tagIds': tagIds,
    };
  }
}
