class UniversityPagination {
  final int limit;
  final int page;
  final String? search;
  final String? location;
  final String? type;

  UniversityPagination({
    this.limit = 10,
    this.page = 1,
    this.search,
    this.location,
    this.type,
  });

  Map<String, dynamic> toMap() {
    final Map<String, dynamic> map = {
      'limit': limit,
      'page': page,
    };

    if (search != null && search!.isNotEmpty) {
      map['search'] = search;
    }
    if (location != null && location!.isNotEmpty) {
      map['location'] = location;
    }
    if (type != null && type!.isNotEmpty) {
      map['type'] = type;
    }

    return map;
  }

  UniversityPagination copyWith({
    int? limit,
    int? page,
    String? search,
    String? location,
    String? type,
  }) {
    return UniversityPagination(
      limit: limit ?? this.limit,
      page: page ?? this.page,
      search: search ?? this.search,
      location: location ?? this.location,
      type: type ?? this.type,
    );
  }
}
