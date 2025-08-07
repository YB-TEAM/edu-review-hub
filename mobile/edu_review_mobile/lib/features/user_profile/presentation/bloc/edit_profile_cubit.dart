import 'package:edu_review_mobile/core/usecases/no_params.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/edit_profile.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/get_user.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/edit_profile_state.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class EditProfileCubit extends Cubit<EditProfileState> {
  EditProfileCubit() : super(EditProfileInitial());

  Future<void> loadProfile() async {
    emit(EditProfileLoading());
    var result = await sl<GetUserUseCase>().call(NoParams());
    result.fold(
      (error) {
        emit(EditProfileFailure(errorMessage: error.message));
      },
      (data) {
        emit(EditProfileLoaded(profileEntity: data));
      },
    );
  }

  Future<void> saveProfile(EditProfileModel editModel) async {
    emit(EditProfileSaving());
    var result = await sl<EditProfileUseCase>().call(editModel);
    result.fold(
      (error) {
        emit(EditProfileFailure(errorMessage: error.message));
      },
      (data) {
        emit(EditProfileSuccess(profileEntity: data));
      },
    );
  }
}
