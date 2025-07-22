import 'package:edu_review_mobile/common/bloc/auth/auth_state.dart';
import 'package:edu_review_mobile/core/usecases/no_params.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/is_logged_in.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AuthStateCubit extends Cubit<AuthState>{
  AuthStateCubit() : super(AppInitialState());

  void appStarted() async {
    try {
      var isLoggedIn = await sl<IsLoggedInUseCase>().call(NoParams());
      if (isLoggedIn) {
        await Future.delayed(const Duration(milliseconds: 100));
        emit(Authenticated());
      } else {
        emit(UnAuthenticated());
      }
    } catch (e) {
      emit(UnAuthenticated());
    }
  }
}