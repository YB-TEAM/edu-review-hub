class BlogPagination {
  final int page;
  final int pageSize;
  final int? authorId;
  final String? tagIds;
  final String? search;
  final String? sortBy;
  final String? sortOrder;
  final String? dateFrom;
  final String? dateTo;
  final int? minViews;
  final int? minLikes;
  final int? minComments;

  BlogPagination({
    this.page = 1,       
    this.pageSize = 10,  
    this.authorId,
    this.tagIds,
    this.search,
    this.sortBy,
    this.sortOrder,
    this.dateFrom,
    this.dateTo,
    this.minViews,
    this.minLikes,
    this.minComments,
  });

  BlogPagination copyWith({
    int? page,
    int? pageSize,
    int? authorId,
    String? tagIds,
    String? search,
    String? sortBy,
    String? sortOrder,
    String? dateFrom,
    String? dateTo,
    int? minViews,
    int? minLikes,
    int? minComments,
  }) {
    return BlogPagination(
      page: page ?? this.page,
      pageSize: pageSize ?? this.pageSize,
      authorId: authorId ?? this.authorId,
      tagIds: tagIds ?? this.tagIds,
      search: search ?? this.search,
      sortBy: sortBy ?? this.sortBy,
      sortOrder: sortOrder ?? this.sortOrder,
      dateFrom: dateFrom ?? this.dateFrom,
      dateTo: dateTo ?? this.dateTo,
      minViews: minViews ?? this.minViews,
      minLikes: minLikes ?? this.minLikes,
      minComments: minComments ?? this.minComments,
    );
  }
}
