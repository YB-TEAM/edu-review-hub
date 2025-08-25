class BlogPagination {
  final int page;
  final int limit;

  BlogPagination({
    this.page = 1,       
    this.limit = 10,  
  });

  BlogPagination copyWith({
    int? page,
    int? limit,
  }) {
    return BlogPagination(
      page: page ?? this.page,
      limit: limit ?? this.limit,
    );
  }
}
