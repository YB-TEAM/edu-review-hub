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
import 'package:edu_review_mobile/features/auth/presentation/pages/sign_up.page.dart';

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
    Navigator.of(context).push(
      PageRouteBuilder(
        pageBuilder:
            (context, animation, secondaryAnimation) => const SignUpPage(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(1.0, 0.0); // Slide từ phải sang
          const end = Offset.zero;
          final tween = Tween(
            begin: begin,
            end: end,
          ).chain(CurveTween(curve: Curves.ease));
          return SlideTransition(
            position: animation.drive(tween),
            child: child,
          );
        },
        transitionDuration: const Duration(milliseconds: 400),
      ),
    );
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
              Navigator.pushReplacementNamed(context, RouteConstant.mainScreen);
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
          child: Stack(
            children: [
              // Nền trắng
              Container(color: Colors.white),
              // Vệt tím nhạt góc trên phải
              Positioned(
                top: -100,
                right: -100,
                child: Container(
                  width: 250,
                  height: 250,
                  decoration: BoxDecoration(
                    color: Color(0xFFD1C4E9).withOpacity(0.55),
                    borderRadius: BorderRadius.only(
                      topRight: Radius.circular(250),
                      bottomLeft: Radius.circular(250),
                    ),
                  ),
                ),
              ),
              // Vệt xanh nhạt góc dưới trái
              Positioned(
                bottom: -100,
                left: -100,
                child: Container(
                  width: 250,
                  height: 250,
                  decoration: BoxDecoration(
                    color: Color(0xFFB3E5FC).withOpacity(0.45),
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(250),
                      topRight: Radius.circular(250),
                    ),
                  ),
                ),
              ),
              GestureDetector(
                onTap: _handleTapOutside,
                child: SingleChildScrollView(
                  padding: EdgeInsets.fromLTRB(30, 150, 30, 0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Sign In',
                          style: Theme.of(
                            context,
                          ).textTheme.headlineLarge?.copyWith(
                            fontFamily: 'Roboto-Bold',
                            color: AppColors.textBlack,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          "Welcome back you've been missed!",
                          style: Theme.of(
                            context,
                          ).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textBlack,
                            fontFamily: 'Roboto-Medium',
                          ),
                          textAlign: TextAlign.center,
                        ),
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
                            SizedBox(height: 4),
                            Align(
                              alignment: Alignment.centerRight,
                              child: CustomTextButton(
                                onPressed: _handleForgotPassword,
                                title: "Forgot Password?",
                              ),
                            ),
                            SizedBox(height: 30),
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
                                  style: Theme.of(context).textTheme.bodyMedium
                                      ?.copyWith(fontWeight: FontWeight.w700),
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
              BlocBuilder<ButtonStateCubit, ButtonState>(
                builder: (context, state) {
                  if (state is ButtonLoadingState) {
                    return AbsorbPointer(
                      absorbing: true,
                      child: Container(
                        color: Colors.black.withOpacity(0.8),
                        child: Container(),
                      ),
                    );
                  }
                  return const SizedBox.shrink();
                },
              ),
            ],
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
