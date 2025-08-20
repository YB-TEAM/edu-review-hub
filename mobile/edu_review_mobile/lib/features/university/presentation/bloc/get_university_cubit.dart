import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/core/error/failures.dart';
import 'package:edu_review_mobile/features/university/data/models/university_list_response.dart';
import 'package:edu_review_mobile/features/university/data/models/university_pagination.dart';
import 'package:edu_review_mobile/features/university/domain/usecases/get_universities.dart';
import 'package:edu_review_mobile/features/university/presentation/bloc/get_university_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/service_locator.dart';

class UniversityCubit extends Cubit<UniversityState> {
  UniversityCubit() : super(UniversityInitial());

  /// Fetch initial list of universities
  Future<Either<Failure, UniversityListResponse>> fetchUniversities({
    UniversityPagination? pagination,
  }) async {
    emit(UniversityLoading());

    final uniPagination = pagination ?? UniversityPagination(page: 1, limit: 10);

    final result = await sl<GetUniversityUseCase>().call(uniPagination);

    result.fold(
      (failure) => emit(UniversityError(errorMessage: failure.message)),
      (universityListResponse) {
        // Nếu dữ liệu trả về ít hơn limit => đã hết dữ liệu
        final hasReachedEnd =
            universityListResponse.universities.length < uniPagination.limit;

        emit(
          UniversityLoaded(
            universities: universityListResponse.universities,
            pagination: uniPagination,
            hasReachedEnd: hasReachedEnd,
          ),
        );
      },
    );

    return result;
  }

  Future<Either<Failure, UniversityListResponse>> loadMoreUniversities(
      UniversityPagination pagination) async {
    if (state is UniversityLoaded) {
      final currentState = state as UniversityLoaded;
      if (currentState.hasReachedEnd) {
        return Left(ServerFailure(message: 'Đã load hết dữ liệu'));
      }

      final nextPage = pagination.copyWith(page: pagination.page + 1);

      final result = await sl<GetUniversityUseCase>().call(nextPage);

      result.fold(
        (failure) => emit(UniversityError(errorMessage: failure.message)),
        (universityListResponse) {
          final newItems = universityListResponse.universities;

          final hasReachedEnd = newItems.length < pagination.limit;

          final updatedUniversities = [
            ...currentState.universities,
            ...newItems,
          ];

          emit(
            currentState.copyWith(
              universities: updatedUniversities,
              pagination: nextPage,
              hasReachedEnd: hasReachedEnd,
            ),
          );
        },
      );

      return result;
    }

    return Left(ServerFailure(message: 'Không thể load thêm university'));
  }
}
