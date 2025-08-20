import 'package:edu_review_mobile/features/university/data/models/university_response.dart';

class UniversityListResponse {
  final List<UniversityResponse> universities;
  final String currentPage;
  final String limit;
  final int totalItems;
  final int totalPages;
  final int itemsInCurrentPage;
  final bool hasPreviousPage;
  final bool hasNextPage;
  final int? previousPage;
  final int? nextPage;

  UniversityListResponse({
    required this.universities,
    required this.currentPage,
    required this.limit,
    required this.totalItems,
    required this.totalPages,
    required this.itemsInCurrentPage,
    required this.hasPreviousPage,
    required this.hasNextPage,
    this.previousPage,
    this.nextPage,
  });

  factory UniversityListResponse.fromJson(Map<String, dynamic> json) {
    return UniversityListResponse(
      universities: (json['universities'] as List)
          .map((e) => UniversityResponse.fromJson(e))
          .toList(),
      currentPage: json['pagination']['currentPage'],
      limit: json['pagination']['limit'],
      totalItems: json['pagination']['totalItems'],
      totalPages: json['pagination']['totalPages'],
      itemsInCurrentPage: json['pagination']['itemsInCurrentPage'],
      hasPreviousPage: json['pagination']['hasPreviousPage'],
      hasNextPage: json['pagination']['hasNextPage'],
      previousPage: json['pagination']['previousPage'],
      nextPage: json['pagination']['nextPage'],
    );
  }
}
