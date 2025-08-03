import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common/widgets/loading/custom_loading_indicator.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/auth/data/models/verify_email_params.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/resend_verification.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/verify_email.dart';
import 'package:edu_review_mobile/features/auth/presentation/bloc/resend_verification.dart';
import 'package:edu_review_mobile/features/auth/presentation/bloc/verify_email_cubit.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class VerifyEmailScreen extends StatefulWidget {
  final String email;

  const VerifyEmailScreen({Key? key, required this.email}) : super(key: key);

  @override
  State<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends State<VerifyEmailScreen> {
  final TextEditingController codeController = TextEditingController();

  void _resendCode(BuildContext context) {
    if (mounted) {
      codeController.clear();
    }

    context.read<ResendVerificationCubit>().execute(
      usecase: sl<ResendVerificationUseCase>(),
      params: widget.email,
    );
  }

  void _verifyEmail(String otp, BuildContext context) {
    context.read<VerifyEmailCubit>().execute(
      usecase: sl<VerifyEmailUseCase>(),
      params: VerifyEmailParams(email: widget.email, otp: otp),
    );

    if (mounted) {
      codeController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => VerifyEmailCubit()),
        BlocProvider(create: (_) => ResendVerificationCubit()),
        BlocProvider(create: (_) => ButtonStateCubit()),
      ],
      child: Scaffold(
        backgroundColor: Colors.white,
        body: MultiBlocListener(
          listeners: [
            BlocListener<VerifyEmailCubit, ButtonState>(
              listener: (context, state) {
                if (state is ButtonSuccessState) {
                  Navigator.pushReplacementNamed(context, RouteConstant.signIn);
                } else if (state is ButtonFailureState) {
                  if (mounted) {
                    codeController.clear();
                  }
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
            ),
            BlocListener<ResendVerificationCubit, ButtonState>(
              listener: (context, state) {
                if (state is ButtonSuccessState) {
                  showAppDialog(
                    context: context,
                    title: 'Code Resent',
                    content: 'Verification code has been resent to ${widget.email}',
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
            ),
          ],
          child: BlocBuilder<VerifyEmailCubit, ButtonState>(
            builder: (context, state) {
              final isVerifying = state is ButtonLoadingState;
              return Stack(
                children: [
                  GestureDetector(
                    onTap: () => FocusScope.of(context).unfocus(),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          const SizedBox(height: 120),
                          Text('Verification Code', style: Theme.of(context).textTheme.headlineMedium),
                          const SizedBox(height: 8),
                          RichText(
                            text: TextSpan(
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textGrey),
                              children: [
                                const TextSpan(text: 'We sent you a 6-digit code (OTP) to your email '),
                                TextSpan(
                                  text: widget.email,
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                        color: AppColors.textGrey,
                                        fontWeight: FontWeight.w700,
                                      ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 32),
                          PinCodeTextField(
                            controller: codeController,
                            appContext: context,
                            length: 6,
                            enabled: !isVerifying,
                            keyboardType: TextInputType.number,
                            onCompleted: (otp) {
                              if(mounted) {
                                _verifyEmail(otp, context);
                              }
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
                                "Didn't Receive the Code? ",
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textGrey),
                              ),
                              BlocBuilder<ResendVerificationCubit, ButtonState>(
                                builder: (context, state) {
                                  final isLoading = state is ButtonLoadingState;
                                  return TextButton(
                                    onPressed: isLoading
                                        ? null
                                        : () => _resendCode(context),
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
                                            'Resend',
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
                    ),
                  ),
                  if (isVerifying)
                    Positioned.fill(
                      child: Container(
                        color: Colors.black.withOpacity(0.5),
                        child: const Center(child: CustomLoadingIndicator()),
                      ),
                    ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}

