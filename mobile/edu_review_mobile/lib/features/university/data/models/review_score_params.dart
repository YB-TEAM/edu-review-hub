class ReviewScoreParams {
  final int criterionId;
  final int score;

  ReviewScoreParams({
    required this.criterionId,
    required this.score,
  });

  Map<String, dynamic> toJson() {
    return {
      'criterionId': criterionId,
      'score': score,
    };
  }
}