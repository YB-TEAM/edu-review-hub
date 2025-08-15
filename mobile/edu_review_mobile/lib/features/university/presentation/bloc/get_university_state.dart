import 'package:edu_review_mobile/features/university/data/models/university_response.dart';

abstract class UniversityState {}

class UniversityInitial extends UniversityState {}

class UniversityLoading extends UniversityState {}

class UniversityLoaded extends UniversityState {
  final List<UniversityResponse> universities;
  UniversityLoaded(this.universities);
}

class UniversityError extends UniversityState {
  final String errorMessage;
  UniversityError({required this.errorMessage});
}
