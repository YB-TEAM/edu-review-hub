import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/constants/route.constant.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/logout.dart';
import 'package:edu_review_mobile/service_locator.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    void _logOut(BuildContext context) {
      context.read<ButtonStateCubit>().execute(usecase: sl<LogOutUseCase>());
    }

    return MultiBlocProvider(
      providers: [BlocProvider(create: (context) => ButtonStateCubit())],
      child: BlocListener<ButtonStateCubit, ButtonState>(
        listener: (context, state) {
          if (state is ButtonSuccessState) {
            Navigator.pushReplacementNamed(context, RouteConstant.signIn);
          }
        },
        child: Scaffold(
          appBar: AppBar(title: const Text('Cài đặt')),
          body: Center(
            child: Builder(
              builder:
                  (buttonContext) => PrimaryButton(
                    onPressed: () => _logOut(buttonContext),
                    title: "Sign Out",
                  ),
            ),
          ),
        ),
      ),
    );
  }
}
