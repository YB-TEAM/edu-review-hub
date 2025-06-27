import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/widgets/button/custom_text_button.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_password_field.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/auth/data/models/signin_params.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/sign_in.dart';
import 'package:edu_review_mobile/service_locator.dart' show sl;
import 'package:flutter_bloc/flutter_bloc.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  // Track if form has been submitted to show validation errors
  bool _isFormSubmitted = false;

  String? _validateEmail(String? value) {
    if (!_isFormSubmitted) return null;
    if (value == null || value.isEmpty) {
      return 'Please enter email';
    }
    // Kiểm tra định dạng email
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    if (!emailRegex.hasMatch(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (!_isFormSubmitted) return null;
    if (value == null || value.isEmpty) {
      return 'Please enter password';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return null;
  }

  void _handleSignIn(BuildContext context) {
    setState(() {
      _isFormSubmitted = true;
    });

    // Force validation to show errors
    _formKey.currentState!.validate();

    // Check if form is valid before proceeding
    if (_emailController.text.isNotEmpty &&
        _passwordController.text.isNotEmpty &&
        _validateEmail(_emailController.text) == null &&
        _validatePassword(_passwordController.text) == null) {
      context.read<ButtonStateCubit>().execute(
        usecase: sl<SignInUseCase>(),
        params: SignInParams(
          email: _emailController.text,
          password: _passwordController.text,
          token: "token",
        ),
      );
    }
  }

  void _handleSignUp() {
    Navigator.pushNamed(context, RouteConstant.signUp);
  }

  void _handleForgotPassword() {}

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
            if (state is ButtonSuccessState) {
              Navigator.pushReplacementNamed(context, RouteConstant.profile);
            }
            if (state is ButtonFailureState) {
              showAppDialog(
                context: context,
                title: 'Error',
                content: state.errorMessage,
                icon: Icons.error_outline,
                iconColor: Colors.red,
                actions: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Close'),
                  ),
                ],
              );
            }
          },
          child: GestureDetector(
            onTap: _handleTapOutside,
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(30, 80, 30, 0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(
                    'assets/images/logo_edureview.png',
                    width: 140,
                    height: 140,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Welcome back!',
                    style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.textBlack,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Sign in to continue using the app',
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.copyWith(color: AppColors.textGrey),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 40),
                  Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CustomTextField(
                          label: 'Email',
                          placeholder: 'Enter your email',
                          prefixIconData: Icons.email_outlined,
                          controller: _emailController,
                          validator: _validateEmail,
                        ),
                        SizedBox(height: 16),
                        CustomPasswordField(
                          label: 'Password',
                          placeholder: 'Enter your password',
                          prefixIcon: Icon(Icons.lock_outline),
                          controller: _passwordController,
                          validator: _validatePassword,
                        ),
                        Align(
                          alignment: Alignment.centerRight,
                          child: CustomTextButton(
                            onPressed: _handleForgotPassword,
                            title: "Forgot Password?",
                          ),
                        ),
                        SizedBox(height: 16),
                        Builder(
                          builder: (context) {
                            return PrimaryButton(
                              title: "Sign In",
                              onPressed: () => _handleSignIn(context),
                            );
                          },
                        ),
                        SizedBox(height: 40),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Don't have an account?",
                              style: Theme.of(context).textTheme.bodyMedium
                                  ?.copyWith(color: AppColors.textGrey),
                            ),
                            CustomTextButton(
                              onPressed: _handleSignUp,
                              title: "Sign up",
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
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
