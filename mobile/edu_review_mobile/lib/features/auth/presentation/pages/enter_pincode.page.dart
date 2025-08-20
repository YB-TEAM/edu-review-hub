import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common/widgets/loading/custom_loading_indicator.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/auth/data/models/reset_password_params.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/forgot_password.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/reset_password.dart';
import 'package:edu_review_mobile/features/auth/presentation/bloc/forgot_password_cubit.dart';
import 'package:edu_review_mobile/features/auth/presentation/bloc/reset_password_cubit.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class EnterPinCodePage extends StatefulWidget {
  final String email;
  final String newPassword;

  const EnterPinCodePage({Key? key, required this.email, required this.newPassword}) : super(key: key);

  @override
  State<EnterPinCodePage> createState() => _EnterPinCodePageState();
}

class _EnterPinCodePageState extends State<EnterPinCodePage> {
  final TextEditingController codeController = TextEditingController();

  void _resendCode(BuildContext context) {
    if (mounted) codeController.clear();
    context.read<ForgotPasswordCubit>().execute(
      usecase: sl<ForgotPasswordUseCase>(),
      params: widget.email,
    );
  }

  void _resetPassword(String otp, BuildContext context) {
    context.read<ResetPasswordCubit>().execute(
      usecase: sl<ResetPasswordUseCase>(),
      params: ResetPasswordParams(email: widget.email, otp: otp, newPassword: widget.newPassword),
    );
    if (mounted) codeController.clear();
  }

  void _handleTapOutside() {
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => ResetPasswordCubit()),
        BlocProvider(create: (_) => ForgotPasswordCubit()),
        BlocProvider(create: (_) => ButtonStateCubit()),
      ],
      child: Scaffold(
        body: MultiBlocListener(
          listeners: [
            BlocListener<ResetPasswordCubit, ButtonState>(
              listener: (context, state) async {
                if (state is ButtonSuccessState) {
                   await showAppDialog(
                    context: context,
                    title: 'Thành công',
                    content: 'Mật khẩu của bạn đã được đặt lại thành công.',
                    icon: Icons.check_circle_outline,
                    iconColor: Colors.green,
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('OK'),
                      ),
                    ],
                  );
                  Navigator.pushReplacementNamed(context, RouteConstant.signIn);
                } else if (state is ButtonFailureState) {
                  if (mounted) codeController.clear();
                  showAppDialog(
                    context: context,
                    title: 'Lỗi',
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
            ),
            BlocListener<ForgotPasswordCubit, ButtonState>(
              listener: (context, state) {
                if (state is ButtonSuccessState) {
                  showAppDialog(
                    context: context,
                    title: 'Đã gửi lại mã',
                    content: 'Mã OTP đã được gửi lại đến ${widget.email}',
                    icon: Icons.email,
                    iconColor: Colors.green,
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.of(context).pop(),
                        child: const Text('OK'),
                      ),
                    ],
                  );
                } else if (state is ButtonFailureState) {
                  showAppDialog(
                    context: context,
                    title: 'Lỗi',
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
            ),
          ],
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
                BlocBuilder<ResetPasswordCubit, ButtonState>(
                  builder: (context, state) {
                    final isVerifying = state is ButtonLoadingState;
                    return SingleChildScrollView(
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
                            'Nhập mã OTP',
                            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                                  color: AppColors.textBlack,
                                ),
                          ),
                          const SizedBox(height: 10),
                          RichText(
                            text: TextSpan(
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: AppColors.textBlack,
                                  ),
                              children: [
                                const TextSpan(text: "Nhập mã gồm 6 số đã được gửi đến email của bạn: "),
                                TextSpan(
                                  text: widget.email,
                                  style: const TextStyle(
                                    color: AppColors.textBlue,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 40),
                          PinCodeTextField(
                            controller: codeController,
                            appContext: context,
                            length: 6,
                            enabled: !isVerifying,
                            keyboardType: TextInputType.number,
                            onCompleted: (otp) {
                              if (mounted) _resetPassword(otp, context);
                            },
                            onChanged: (_) {},
                            pinTheme: PinTheme(
                              shape: PinCodeFieldShape.box,
                              borderRadius: BorderRadius.circular(8),
                              fieldHeight: 56,
                              fieldWidth: 45,
                              activeFillColor: Colors.white,
                              inactiveFillColor: Colors.white,
                              selectedFillColor: Colors.white,
                              activeColor: const Color(0xFF007BFF),
                              inactiveColor: Colors.grey[300]!,
                              selectedColor: const Color(0xFF007BFF),
                            ),
                            enableActiveFill: true,
                            textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Bạn chưa nhận được mã? ",
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textGrey),
                              ),
                              BlocBuilder<ForgotPasswordCubit, ButtonState>(
                                builder: (context, state) {
                                  final isLoading = state is ButtonLoadingState;
                                  return TextButton(
                                    onPressed: isLoading ? null : () => _resendCode(context),
                                    style: TextButton.styleFrom(
                                      padding: EdgeInsets.zero,
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                    ),
                                    child: isLoading
                                        ? SizedBox(
                                            height: 16,
                                            width: 16,
                                            child: CircularProgressIndicator(
                                              strokeWidth: 2,
                                              valueColor: AlwaysStoppedAnimation<Color>(AppColors.textBlue),
                                            ),
                                          )
                                        : Text(
                                            'Gửi lại',
                                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                                  color: AppColors.textBlue,
                                                  fontWeight: FontWeight.w700,
                                                ),
                                          ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
                BlocBuilder<ResetPasswordCubit, ButtonState>(
                  builder: (context, state) {
                    if (state is ButtonLoadingState) {
                      return Container(
                        color: Colors.black.withOpacity(0.5),
                        child: const Center(child: CustomLoadingIndicator()),
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
}