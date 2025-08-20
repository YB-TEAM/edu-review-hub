import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_password_field.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/forgot_password.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  bool _isFormSubmitted = false;

  String? _validateEmail(String? value) {
    if (!_isFormSubmitted) return null;
    if (value == null || value.isEmpty) {
      return 'Vui lòng nhập email';
    }
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    if (!emailRegex.hasMatch(value)) {
      return 'Email không hợp lệ';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (!_isFormSubmitted) return null;
    if (value == null || value.isEmpty) {
      return 'Vui lòng nhập mật khẩu';
    }
    if (value.length < 3) {
      return 'Mật khẩu phải có ít nhất 3 ký tự';
    }
    if (value.length > 50) {
      return 'Mật khẩu không được vượt quá 50 ký tự';
    }
    if (!RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)').hasMatch(value)) {
      return 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
    }
    return null;
  }

  String? _validateConfirmPassword(String? value) {
    if (!_isFormSubmitted) return null;
    if (value == null || value.isEmpty) {
      return 'Vui lòng xác nhận mật khẩu';
    }
    if (value != _newPasswordController.text) {
      return 'Mật khẩu không khớp';
    }
    return null;
  }

  void _handleSubmit(BuildContext context) async {
    setState(() {
      _isFormSubmitted = true;
    });
    if (_formKey.currentState!.validate()) {
      context.read<ButtonStateCubit>().execute(
        usecase: sl<ForgotPasswordUseCase>(),
        params: _emailController.text,
      );
    }
  }

  void _handleTapOutside() {
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocProvider(
        create: (_) => ButtonStateCubit(),
        child: BlocListener<ButtonStateCubit, ButtonState>(
          listener: (context, state) {
            if (state is ButtonSuccessState) {
              Navigator.pushNamed(
                context,
                RouteConstant.enterPincode,
                arguments: {
                  'email': _emailController.text,
                  'newPassword': _newPasswordController.text,
                },
              );
            }
            if (state is ButtonFailureState) {
              showAppDialog(
                context: context,
                title: 'Lỗi',
                content: state.errorMessage,
                icon: Icons.error_outline,
                iconColor: Colors.red,
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Đóng'),
                  ),
                ],
              );
            }
          },
          child: GestureDetector(
            onTap: _handleTapOutside,
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
                      color: const Color(0xFFD1C4E9).withOpacity(0.55),
                      borderRadius: const BorderRadius.only(
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
                      color: const Color(0xFFB3E5FC).withOpacity(0.45),
                      borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(250),
                        topRight: Radius.circular(250),
                      ),
                    ),
                  ),
                ),
                SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(30, 60, 30, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF7F7F9),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.chevron_left, size: 24),
                          color: AppColors.textBlack,
                          onPressed: () => Navigator.pop(context),
                        ),
                      ),
                      const SizedBox(height: 30),
                      Text(
                        'Quên mật khẩu',
                        style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                              color: AppColors.textBlack,
                            ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        "Vui lòng nhập email và đặt mật khẩu mới.",
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textBlack,
                            ),
                      ),
                      const SizedBox(height: 40),
                      Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            CustomTextField(
                              label: 'Email',
                              placeholder: 'Nhập email',
                              prefixIconData: Icons.email_outlined,
                              controller: _emailController,
                              validator: _validateEmail,
                            ),
                            const SizedBox(height: 20),
                            CustomPasswordField(
                              label: 'Mật khẩu mới',
                              placeholder: 'Nhập mật khẩu mới',
                              controller: _newPasswordController,
                              validator: _validatePassword,
                              prefixIconData: Icons.lock_outline,
                            ),
                            const SizedBox(height: 20),
                            CustomPasswordField(
                              label: 'Xác nhận mật khẩu',
                              placeholder: 'Nhập lại mật khẩu',
                              controller: _confirmPasswordController,
                              validator: _validateConfirmPassword,
                              prefixIconData: Icons.lock_outline,
                            ),
                            const SizedBox(height: 30),
                            Builder(
                              builder: (context) {
                                return PrimaryButton(
                                  title: "Đổi mật khẩu",
                                  onPressed: () => _handleSubmit(context),
                                );
                              },
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
                BlocBuilder<ButtonStateCubit, ButtonState>(
                  builder: (context, state) {
                    if (state is ButtonLoadingState) {
                      FocusScope.of(context).unfocus();
                      return AbsorbPointer(
                        absorbing: true,
                        child: Container(
                          color: Colors.black.withOpacity(0.8),
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
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
}
