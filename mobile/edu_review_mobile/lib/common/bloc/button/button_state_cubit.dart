import 'package:dartz/dartz.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/core/usecases/usecase.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ButtonStateCubit extends Cubit<ButtonState>{
  ButtonStateCubit() : super(ButtonInitialState());
  
  void execute({dynamic params, required UseCase usecase}) async {
    emit(ButtonLoadingState());
    await Future.delayed(const Duration(seconds: 2));
    try {
      Either result = await usecase.call(params);

      result.fold(
        (error) {
          emit(
            ButtonFailureState(errorMessage: error.message)
          );
        }, 
        (data) {
          emit(ButtonSuccessState());
        }
      );
    } catch (e) {
      emit(
        ButtonFailureState(errorMessage: e.toString())
      );
    }
  }
}
