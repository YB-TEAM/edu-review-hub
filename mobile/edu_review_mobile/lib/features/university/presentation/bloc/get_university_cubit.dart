import 'package:edu_review_mobile/features/university/domain/usecases/get_universities.dart';
import 'package:edu_review_mobile/features/university/presentation/bloc/get_university_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/core/usecases/no_params.dart';
import 'package:edu_review_mobile/service_locator.dart';

class UniversityCubit extends Cubit<UniversityState> {
  UniversityCubit() : super(UniversityInitial());

  final GetUniversityUseCase _getUniversityUseCase = sl<GetUniversityUseCase>();

  Future<void> getUniversities() async {
    emit(UniversityLoading());
    final result = await _getUniversityUseCase(NoParams());

    result.fold(
      (failure) => emit(UniversityError(errorMessage: failure.message)),
      (data) => emit(UniversityLoaded(data.universities)),
    );
  }
}
