import 'package:edu_review_mobile/features/university/data/models/review_score_params.dart';

class ReviewParams {
  final int universityId;
  final String content;
  final String? pros;
  final String? cons;
  final String? recommendation;
  final double overallScore;
  final String reviewType; // student, alumni, parent, visitor, staff
  final String? studyProgram;
  final int? studyYear;
  final int? graduationYear;
  final bool isAnonymous;
  final List<ReviewScoreParams> scores;

  ReviewParams({
    required this.universityId,
    required this.content,
    this.pros,
    this.cons,
    this.recommendation,
    required this.overallScore,
    required this.reviewType,
    this.studyProgram,
    this.studyYear,
    this.graduationYear,
    required this.isAnonymous,
    required this.scores,
  });

  Map<String, dynamic> toJson() {
    return {
      'university_id': universityId,
      'content': content,
      'pros': pros,
      'cons': cons,
      'recommendation': recommendation,
      'overall_score': overallScore,
      'review_type': reviewType,
      'study_program': studyProgram,
      'study_year': studyYear,
      'graduation_year': graduationYear,
      'is_anonymous': isAnonymous,
      'scores': scores.map((e) => e.toJson()).toList(),
    };
  }
}