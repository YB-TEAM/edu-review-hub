import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/constants/route.constant.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/logout.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user_display_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/user_display_state.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    void _logOut(BuildContext context) {
      context.read<ButtonStateCubit>().execute(usecase: sl<LogOutUseCase>());
    }

    return Scaffold(
      body: Center(
        child: MultiBlocProvider(
          providers: [
            BlocProvider(
              create: (context) => UserDisplayCubit()..displayUser(),
            ),
            BlocProvider(create: (context) => ButtonStateCubit()),
          ],
          child: BlocListener<ButtonStateCubit, ButtonState>(
            listener: (context, state) {
              if (state is ButtonSuccessState) {
                Navigator.pushReplacementNamed(context, RouteConstant.signIn);
              }
            },
            child: BlocBuilder<UserDisplayCubit, UserDisplayState>(
              builder: (context, state) {
                if (state is UserLoading) {
                  return CircularProgressIndicator();
                }
                if (state is UserLoaded) {
                  return SingleChildScrollView(
                    child: Center(
                      child: Padding(
                        padding: EdgeInsetsGeometry.symmetric(horizontal: 20),
                        child: Column(
                          children: [
                            Text(state.userEntity.userName),
                            Text(state.userEntity.email),
                            Builder(
                              builder: (context) {
                                return PrimaryButton(
                                  onPressed: () => _logOut(context),
                                  title: "Sign Out",
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }
                if (state is LoadUserFailure) {
                  return Text(state.errorMessage);
                }
                return Container();
              },
            ),
          ),
        ),
      ),
    );
  }
}
