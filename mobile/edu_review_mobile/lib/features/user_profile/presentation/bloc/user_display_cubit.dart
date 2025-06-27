import 'package:edu_review_mobile/core/usecases/no_params.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/get_user.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user_display_state.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class UserDisplayCubit extends Cubit<UserDisplayState> {
  UserDisplayCubit() : super (UserLoading());

  Future<void> displayUser() async {
    var result = await sl<GetUserUseCase>().call(NoParams());
    result.fold(
      (error) {
        emit(LoadUserFailure(errorMessage: error));
      },
      (data) {
        emit(UserLoaded(userEntity: data));
      }
    );
  } 
}