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
import 'package:edu_review_mobile/features/auth/presentation/pages/sign_in.page.dart';

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

  // Track if form has been submitted to show validation errors
  bool _isFormSubmitted = false;

  String? _validateUsername(String? value) {
    if (!_isFormSubmitted) return null;
    if (value == null || value.isEmpty) {
      return 'Please enter username';
    }
    if (value.length < 6) {
      return 'Username must be at least 6 characters';
    }
    if (value.length > 20) {
      return 'Username cannot exceed 20 characters';
    }
    // Chỉ cho phép chữ cái, số, dấu gạch dưới, không có khoảng trắng hoặc ký tự đặc biệt
    final usernameRegex = RegExp(r'^[a-zA-Z0-9_]+$');
    if (!usernameRegex.hasMatch(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  }

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
    if (value.length < 3) {
      return 'Password must be at least 3 characters';
    }
    if (value.length > 50) {
      return 'Password cannot exceed 50 characters';
    }
    // Kiểm tra có ít nhất 1 chữ hoa, 1 chữ thường, 1 số
    if (!RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)').hasMatch(value)) {
      return 'Password must contain at least 1 uppercase, 1 lowercase and 1 number';
    }
    return null;
  }

  String? _validateConfirmedPassword(String? value) {
    if (!_isFormSubmitted) return null;
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    if (value != _passwordController.text) {
      return 'Passwords do not match';
    }
    return null;
  }

  void _handleSignUp(BuildContext context) {
    setState(() {
      _isFormSubmitted = true;
    });

    // Force validation to show errors
    _formKey.currentState!.validate();

    // Check if form is valid before proceeding
    if (_usernameController.text.isNotEmpty &&
      _emailController.text.isNotEmpty &&
      _passwordController.text.isNotEmpty &&
      _confirmedpasswordController.text.isNotEmpty &&
      _validateUsername(_usernameController.text) == null &&
      _validateEmail(_emailController.text) == null &&
      _validatePassword(_passwordController.text) == null &&
      _validateConfirmedPassword(_confirmedpasswordController.text) == null) {
      context.read<ButtonStateCubit>().execute(
        usecase: sl<SignUpUseCase>(),
        params: SignUpParams(
          username: _usernameController.text,
          email: _emailController.text,
          password: _passwordController.text,
        ),
      );
    }
  }

  void _handleSignIn() {
    Navigator.of(context).push(
      PageRouteBuilder(
        pageBuilder:
            (context, animation, secondaryAnimation) => const SignInPage(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(-1.0, 0.0); 
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
              Container(color: Colors.white),
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
                  padding: EdgeInsets.fromLTRB(30, 100, 30, 0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Sign Up',
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
                          "Just a few quick things to get started",
                          style: Theme.of(
                            context,
                          ).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textBlack,
                            fontFamily: 'Roboto-Medium',
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      SizedBox(height: 28),
                      Form(
                        key: _formKey,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CustomTextField(
                              label: 'Username',
                              placeholder: 'Enter your username',
                              controller: _usernameController,
                              validator: _validateUsername,
                              prefixIconData: Icons.email_outlined,
                            ),
                            SizedBox(height: 16),
                            CustomTextField(
                              label: 'Email',
                              placeholder: 'Enter your email',
                              controller: _emailController,
                              validator: _validateEmail,
                              prefixIconData: Icons.email_outlined,
                            ),
                            SizedBox(height: 16),
                            CustomPasswordField(
                              label: 'Password',
                              placeholder: 'Enter your password',
                              controller: _passwordController,
                              validator: _validatePassword,
                              prefixIconData: Icons.lock_outline,
                            ),
                            SizedBox(height: 16),
                            CustomPasswordField(
                              label: 'Confirm Password',
                              placeholder: 'Re-enter your password',
                              controller: _confirmedpasswordController,
                              validator: _validateConfirmedPassword,
                              prefixIconData: Icons.lock_outline,
                            ),
                            SizedBox(height: 46),
                            Builder(
                              builder: (context) {
                                return PrimaryButton(
                                  title: "Sign Up",
                                  onPressed: () => _handleSignUp(context),
                                );
                              },
                            ),
                            SizedBox(height: 40),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "Already have an account?",
                                  style: Theme.of(context).textTheme.bodyMedium
                                      ?.copyWith(color: AppColors.textGrey),
                                ),
                                CustomTextButton(
                                  onPressed: _handleSignIn,
                                  title: "Sign in",
                                  style: Theme.of(
                                    context,
                                  ).textTheme.bodyMedium?.copyWith(
                                    color: AppColors.textBlack,
                                    fontWeight: FontWeight.w700,
                                  ),
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
