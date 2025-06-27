import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/features/dashboard/presentation/bloc/user_display_cubit.dart';
import 'package:edu_review_mobile/features/dashboard/presentation/bloc/user_display_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    void _logOut(BuildContext context) {

    }

    return Scaffold(
      body: Center(
        child: MultiBlocProvider(
          providers: [
            BlocProvider(create: (context) => UserDisplayCubit()..displayUser()),
            BlocProvider(create: (context) => ButtonStateCubit()),
          ],
          child: BlocBuilder<UserDisplayCubit,UserDisplayState>(
            builder: (context, state) {
              if(state is UserLoading) {
                return CircularProgressIndicator();
              }
              if(state is UserLoaded) {
                return SingleChildScrollView(
                  child: Center(
                    child: Column(
                      children: [
                        Text(state.userEntity.userName),
                        Text(state.userEntity.email),
                        PrimaryButton(
                          onPressed: () => {}, 
                          title: "Sign Out",
                        )
                      ],
                    ),
                  ),
                );
              }
              if(state is LoadUserFailure) {
                return Text(state.errorMessage);
              }
              return Container();
            }
          ),
        ),
      ),
    );
  }
}