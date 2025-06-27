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
  
  // Track if form has been submitted to show validation errors
  bool _isFormSubmitted = false;

  String? _validateUsername(String? value) {
    if (!_isFormSubmitted) return null;
    if (value == null || value.isEmpty) {
      return 'Please enter username';
    }
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (value.length > 20) {
      return 'Username cannot exceed 20 characters';
    }
    // Kiểm tra ký tự đặc biệt
    if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(value)) {
      return 'Username can only contain letters, numbers and underscore';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    if (!_isFormSubmitted) return null;
    if (value == null || value.isEmpty) {
      return 'Please enter email';
    }
    // Kiểm tra định dạng email
    final emailRegex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
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
                    child: const Text('Close'),
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
                          validator: _validatePassword,
                        ),
                        SizedBox(height: 16),
                        CustomPasswordField(
                          placeholder: "Confirm Password",
                          controller: _confirmedpasswordController,
                          validator: _validateConfirmedPassword,
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