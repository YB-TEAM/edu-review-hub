import 'package:edu_review_mobile/features/blog/data/models/blog_response.dart';

class BlogListResponse {
  final List<BlogResponse> data;
  final PaginationMetadata metadata;
  final BlogStatistics statistics;

  BlogListResponse({
    required this.data,
    required this.metadata,
    required this.statistics,
  });

  factory BlogListResponse.fromJson(Map<String, dynamic> json) {
    return BlogListResponse(
      data: (json['data'] as List<dynamic>)
          .map((e) => BlogResponse.fromJson(e))
          .toList(),
      metadata: PaginationMetadata.fromJson(json['metadata']),
      statistics: BlogStatistics.fromJson(json['statistics']),
    );
  }

  Map<String, dynamic> toJson() => {
        'data': data.map((e) => e.toJson()).toList(),
        'metadata': metadata.toJson(),
        'statistics': statistics.toJson(),
      };
}

class PaginationMetadata {
  final int totalItems;
  final int pageSize;
  final int currentPage;
  final int totalPages;

  PaginationMetadata({
    required this.totalItems,
    required this.pageSize,
    required this.currentPage,
    required this.totalPages,
  });

  factory PaginationMetadata.fromJson(Map<String, dynamic> json) {
    return PaginationMetadata(
      totalItems: json['totalItems'] ?? 0,
      pageSize: json['pageSize'] ?? 0,
      currentPage: json['currentPage'] ?? 1,
      totalPages: json['totalPages'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'totalItems': totalItems,
    'pageSize': pageSize,
    'currentPage': currentPage,
    'totalPages': totalPages,
  };
}

class BlogStatistics {
  final int totalBlogs;
  final int approvedBlogs;
  final int pendingBlogs;
  final int totalViews;
  final int totalLikes;
  final int totalComments;

  BlogStatistics({
    required this.totalBlogs,
    required this.approvedBlogs,
    required this.pendingBlogs,
    required this.totalViews,
    required this.totalLikes,
    required this.totalComments,
  });

  factory BlogStatistics.fromJson(Map<String, dynamic> json) {
    return BlogStatistics(
      totalBlogs: json['totalBlogs'] ?? 0,
      approvedBlogs: json['approvedBlogs'] ?? 0,
      pendingBlogs: json['pendingBlogs'] ?? 0,
      totalViews: int.tryParse(json['totalViews']?.toString() ?? '0') ?? 0,
      totalLikes: int.tryParse(json['totalLikes']?.toString() ?? '0') ?? 0,
      totalComments: int.tryParse(json['totalComments']?.toString() ?? '0') ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'totalBlogs': totalBlogs,
    'approvedBlogs': approvedBlogs,
    'pendingBlogs': pendingBlogs,
    'totalViews': totalViews,
    'totalLikes': totalLikes,
    'totalComments': totalComments,
  };
}
