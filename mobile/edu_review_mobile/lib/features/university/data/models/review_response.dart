class ReviewResponse {
  final int id;
  final int universityId;
  final int userId;
  final String content;
  final String pros;
  final String cons;
  final String recommendation;
  final double overallScore;
  final String status; // pending, approved, rejected, hidden
  final String reviewType; // student, alumni, parent, visitor, staff
  final String studyProgram;
  final int studyYear;
  final int graduationYear;
  final bool isAnonymous;
  final bool isVerified;
  final bool isHelpful;
  final int helpfulCount;
  final int reportCount;
  final String? adminNotes;
  final int? moderatorId;
  final DateTime? moderatedAt;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? deletedAt;

  ReviewResponse({
    required this.id,
    required this.universityId,
    required this.userId,
    required this.content,
    required this.pros,
    required this.cons,
    required this.recommendation,
    required this.overallScore,
    required this.status,
    required this.reviewType,
    required this.studyProgram,
    required this.studyYear,
    required this.graduationYear,
    required this.isAnonymous,
    required this.isVerified,
    required this.isHelpful,
    required this.helpfulCount,
    required this.reportCount,
    this.adminNotes,
    this.moderatorId,
    this.moderatedAt,
    required this.createdAt,
    required this.updatedAt,
    this.deletedAt,
  });

  /// Parse từ JSON
  factory ReviewResponse.fromJson(Map<String, dynamic> json) {
    return ReviewResponse(
      id: json['id'] as int,
      universityId: json['university_id'] as int,
      userId: json['user_id'] as int,
      content: json['content'] as String,
      pros: json['pros'] as String,
      cons: json['cons'] as String,
      recommendation: json['recommendation'] as String,
      overallScore: (json['overall_score'] as num).toDouble(),
      status: json['status'] as String,
      reviewType: json['review_type'] as String,
      studyProgram: json['study_program'] as String,
      studyYear: json['study_year'] as int,
      graduationYear: json['graduation_year'] as int,
      isAnonymous: json['is_anonymous'] as bool,
      isVerified: json['is_verified'] as bool,
      isHelpful: json['is_helpful'] as bool,
      helpfulCount: json['helpful_count'] as int,
      reportCount: json['report_count'] as int,
      adminNotes: json['admin_notes'] as String?,
      moderatorId: json['moderator_id'] as int?,
      moderatedAt: json['moderated_at'] != null
          ? DateTime.tryParse(json['moderated_at'])
          : null,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      deletedAt: json['deleted_at'] != null
          ? DateTime.tryParse(json['deleted_at'])
          : null,
    );
  }

  /// Convert sang JSON
  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "university_id": universityId,
      "user_id": userId,
      "content": content,
      "pros": pros,
      "cons": cons,
      "recommendation": recommendation,
      "overall_score": overallScore,
      "status": status,
      "review_type": reviewType,
      "study_program": studyProgram,
      "study_year": studyYear,
      "graduation_year": graduationYear,
      "is_anonymous": isAnonymous,
      "is_verified": isVerified,
      "is_helpful": isHelpful,
      "helpful_count": helpfulCount,
      "report_count": reportCount,
      "admin_notes": adminNotes,
      "moderator_id": moderatorId,
      "moderated_at": moderatedAt?.toIso8601String(),
      "created_at": createdAt.toIso8601String(),
      "updated_at": updatedAt.toIso8601String(),
      "deleted_at": deletedAt?.toIso8601String(),
    };
  }

  /// Tạo bản copy để update 1 phần
  ReviewResponse copyWith({
    int? id,
    int? universityId,
    int? userId,
    String? content,
    String? pros,
    String? cons,
    String? recommendation,
    double? overallScore,
    String? status,
    String? reviewType,
    String? studyProgram,
    int? studyYear,
    int? graduationYear,
    bool? isAnonymous,
    bool? isVerified,
    bool? isHelpful,
    int? helpfulCount,
    int? reportCount,
    String? adminNotes,
    int? moderatorId,
    DateTime? moderatedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? deletedAt,
  }) {
    return ReviewResponse(
      id: id ?? this.id,
      universityId: universityId ?? this.universityId,
      userId: userId ?? this.userId,
      content: content ?? this.content,
      pros: pros ?? this.pros,
      cons: cons ?? this.cons,
      recommendation: recommendation ?? this.recommendation,
      overallScore: overallScore ?? this.overallScore,
      status: status ?? this.status,
      reviewType: reviewType ?? this.reviewType,
      studyProgram: studyProgram ?? this.studyProgram,
      studyYear: studyYear ?? this.studyYear,
      graduationYear: graduationYear ?? this.graduationYear,
      isAnonymous: isAnonymous ?? this.isAnonymous,
      isVerified: isVerified ?? this.isVerified,
      isHelpful: isHelpful ?? this.isHelpful,
      helpfulCount: helpfulCount ?? this.helpfulCount,
      reportCount: reportCount ?? this.reportCount,
      adminNotes: adminNotes ?? this.adminNotes,
      moderatorId: moderatorId ?? this.moderatorId,
      moderatedAt: moderatedAt ?? this.moderatedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }
}
