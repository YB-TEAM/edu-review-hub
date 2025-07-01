import 'package:edu_review_mobile/core/config/theme/color.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/constants/route.constant.dart';
import 'package:edu_review_mobile/features/user_profile/domain/usecases/logout.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:edu_review_mobile/features/settings/presentation/widgets/navigation_button.dart';

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
          body: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    "Account & Security",
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontFamily: 'Roboto-Bold',
                      color: AppColors.textBlack,
                    ),
                  ),
                  const SizedBox(height: 12),
                  NavigationButton(
                    leadingIcon: Icons.person,
                    title: "Personal Information",
                    trailingIcon: Icons.arrow_forward_ios,
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  NavigationButton(
                    leadingIcon: Icons.key,
                    title: 'Change Password',
                    trailingIcon: Icons.arrow_forward_ios,
                    onTap: () {},
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "Settings",
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontFamily: 'Roboto-Bold',
                      color: AppColors.textBlack,
                    ),
                  ),
                  const SizedBox(height: 12),
                  NavigationButton(
                    leadingIcon: Icons.book,
                    title: 'Terms & Conditions',
                    trailingIcon: Icons.arrow_forward_ios,
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  NavigationButton(
                    leadingIcon: Icons.lock,
                    title: 'Privacy Policy',
                    trailingIcon: Icons.arrow_forward_ios,
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  NavigationButton(
                    leadingIcon: Icons.phone,
                    title: 'Contact Us',
                    trailingIcon: Icons.arrow_forward_ios,
                    onTap: () {},
                  ),
                  const SizedBox(height: 24),
                  Builder(
                    builder:
                        (buttonContext) => PrimaryButton(
                          onPressed: () => _logOut(buttonContext),
                          title: "Sign Out",
                          backgroundColor: AppColors.secondaryGrey,
                          textColor: AppColors.textBlack,
                        ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
