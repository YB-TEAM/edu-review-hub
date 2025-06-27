import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/widgets/button/custom_text_button.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_password_field.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/auth/data/models/signup_params.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/sign_up.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmedpasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  String? _validateUsername(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter the username';
    }
    return null;
  }
  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter the email';
    }
    return null;
  }

  void _handleSignUp(BuildContext context) {
    if (_formKey.currentState!.validate()) {
      context.read<ButtonStateCubit>().execute(
        usecase: sl<SignUpUseCase>(),
        params: SignUpParams(
          email: _emailController.text, 
          password: _passwordController.text, 
          userName: _usernameController.text,
          token: "oTsU8cUUxGVwPJPGQPZb1MHjmZXjOxKA3ghkSMsGs6eXf3PIvzCxabRESjmbeKyS"
        ),
      );
    }
  }

  void _handleSignIn() {
    Navigator.pushNamed(context, RouteConstant.signIn);
  }

  void _handleTapOutside() {
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocProvider(
        create: (context) => ButtonStateCubit(),
        child: BlocListener<ButtonStateCubit, ButtonState>(
          listener: (context, state) {
            if(state is ButtonSuccessState) {
              Navigator.pushReplacementNamed(context, RouteConstant.profile);
            }
            if(state is ButtonFailureState) {
              showAppDialog(
                context: context,
                title: 'Error',
                content: state.errorMessage,
                icon: Icons.error_outline,
                iconColor: Colors.red,
                actions: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Đóng'),
                  ),
                ],
              );
            }
          },
          child: GestureDetector(
            onTap: _handleTapOutside,
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(30, 100, 30, 0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children:[
                  Text(
                    'Sign up now',
                    style: Theme.of(context).textTheme.headlineLarge,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Please fill the details and create account',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textGrey,
                    ),
                  ),
                  SizedBox(height: 40),
                  Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CustomTextField(
                          placeholder: 'Username',
                          controller: _usernameController,
                          validator: _validateUsername,
                        ),
                        SizedBox(height: 16),
                        CustomTextField(
                          placeholder: 'Email',
                          controller: _emailController,
                          validator: _validateEmail,
                        ),
                        SizedBox(height: 16),
                        CustomPasswordField(
                          controller: _passwordController,
                        ),
                        SizedBox(height: 8),
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text("Password must be 8 character",
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppColors.textGrey,
                            ),
                          )
                        ),
                        SizedBox(height: 16),
                        CustomPasswordField(
                          placeholder: "Confirmed Password",
                          controller: _confirmedpasswordController,
                        ),
                        SizedBox(height: 30),
                        Builder(
                          builder: (context) {
                            return PrimaryButton(
                              title: "Sign Up",
                              onPressed: () => _handleSignUp(context),
                            );
                          }
                        ),
                        SizedBox(height: 40),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Already have an account?",
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppColors.textGrey,
                              ),
                            ),
                            CustomTextButton(
                              onPressed: _handleSignIn,
                              title: "Sign in",
                            ),
                          ],
                        ),
                      ],
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

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}