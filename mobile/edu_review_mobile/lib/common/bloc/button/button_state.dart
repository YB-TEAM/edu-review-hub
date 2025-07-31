abstract class ButtonState {}

class ButtonInitialState extends ButtonState {}

class ButtonLoadingState extends ButtonState {}

class ButtonSuccessState extends ButtonState {}

class ButtonFailureState extends ButtonState {
  final String errorMessage;
  final int? statusCode;
  ButtonFailureState({required this.errorMessage, this.statusCode});
}