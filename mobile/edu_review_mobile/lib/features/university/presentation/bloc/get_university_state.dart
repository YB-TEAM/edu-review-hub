import 'package:edu_review_mobile/features/university/data/models/university_pagination.dart';
import 'package:edu_review_mobile/features/university/data/models/university_response.dart';

abstract class UniversityState {}

class UniversityInitial extends UniversityState {}

class UniversityLoading extends UniversityState {}

class UniversityLoaded extends UniversityState {
  final List<UniversityResponse> universities;
  final UniversityPagination pagination;
  final bool hasReachedEnd;

  UniversityLoaded({
    required this.universities,
    required this.pagination,
    this.hasReachedEnd = false,
  });

  UniversityLoaded copyWith({
    List<UniversityResponse>? universities,
    UniversityPagination? pagination,
    bool? hasReachedEnd,
  }) {
    return UniversityLoaded(
      universities: universities ?? this.universities,
      pagination: pagination ?? this.pagination,
      hasReachedEnd: hasReachedEnd ?? this.hasReachedEnd,
    );
  }
}


class UniversityError extends UniversityState {
  final String errorMessage;

  UniversityError({required this.errorMessage});
}
