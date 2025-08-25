import 'package:edu_review_mobile/core/usecases/no_params.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/get_user.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user/user_display_state.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class UserCubit extends Cubit<UserState> {
  UserCubit() : super(UserInitial());

  Future<void> fetchUser() async {
    emit(UserLoading());

    final result = await sl<GetUserUseCase>().call(NoParams());

    result.fold(
      (failure) => emit(UserError(failure.message)),
      (profile) => emit(UserLoaded(profile)),
    );
  }

  Future<void> reloadUser() async {
    await fetchUser();
  }
}
