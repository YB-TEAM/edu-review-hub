import 'package:edu_review_mobile/common/bloc/auth/auth_state.dart';
import 'package:edu_review_mobile/core/usecases/no_params.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/is_logged_in.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AuthStateCubit extends Cubit<AuthState>{
  AuthStateCubit() : super(AppInitialState());

  void appStarted() async {
    var isLoggedIn = await sl<IsLoggedInUseCase>().call(NoParams());
    if (isLoggedIn) {
      emit (Authenticated());
    } else {
      emit (UnAuthenticated());
    }
  }
}