import 'package:edu_review_mobile/common/bloc/button/button_state.dart';
import 'package:edu_review_mobile/common/bloc/button/button_state_cubit.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/auth/data/models/verify_email_params.dart';
import 'package:edu_review_mobile/features/auth/domain/usecases/verify_email.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class VerifyEmailScreen extends StatefulWidget {
  final String email;

  VerifyEmailScreen({
    Key? key,
    required this.email,
  }) : super(key: key);

  @override
  _VerifyEmailScreenState createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends State<VerifyEmailScreen> {

  String _otp = '';
  bool isVerifying = false;

  Widget _buildLoadingOverlay() {
    return Positioned.fill(
      child: Container(
        color: Colors.black.withOpacity(0.5),
        child: const Center(
          child: CircularProgressIndicator(
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  void _handleVerifyEmail(BuildContext context) async {
    context.read<ButtonStateCubit>().execute(
      usecase: sl<VerifyEmailUseCase>(),
      params: VerifyEmailParams(
        otp: _otp,
        email: widget.email,
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: BlocProvider(
        create: (context) => ButtonStateCubit(),
        child: BlocListener<ButtonStateCubit, ButtonState>(
          listener: (context, state) {
            if (state is ButtonSuccessState) {
              Navigator.pushReplacementNamed(context, RouteConstant.signIn);
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
              GestureDetector(
                onTap: () {
                  FocusScope.of(context).unfocus();
                },
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(height: 20),
                      Text(
                        'Verification Code', 
                        style: Theme.of(context).textTheme.headlineMedium,
                      ),
                      SizedBox(height: 8),
                      RichText(
                        text: TextSpan(
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textGrey
                          ),
                          children: [
                            TextSpan(
                              text: 'We sent you a 6-digit code (OTP) to your email ',
                            ),
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
                      SizedBox(height: 32),
                      PinCodeTextField(
                        appContext: context,
                        length: 6,
                        enabled: !isVerifying,
                        onChanged: (value) {
                          setState(() {
                            _otp = value;
                          });
                        },
                        keyboardType: TextInputType.number,
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
                        textStyle: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                        ),
                        onCompleted: (otp) async {
                          debugPrint("OTP completed: $otp");
                          debugPrint(widget.email);
                          context.read<ButtonStateCubit>().execute(
                            usecase: sl<VerifyEmailUseCase>(),
                            params: VerifyEmailParams(
                              otp: otp,
                              email: widget.email,
                            )
                          );
                        },
                      ),
                      SizedBox(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Didn't Receive the Code? ",
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textGrey
                            ),
                          ),
                          TextButton(
                            onPressed: () async {
                              
                            },
                            style: TextButton.styleFrom(
                              padding: EdgeInsets.zero,
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            child: Text(
                              'Resend',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppColors.textBlue,
                                fontWeight: FontWeight.w700
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 46),
                      Builder(
                        builder: (context) {
                          return PrimaryButton(
                            title: "Verify",
                            onPressed: () => _handleVerifyEmail(context),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
              
              if (isVerifying) _buildLoadingOverlay(),
              
              BlocBuilder<ButtonStateCubit, ButtonState>(
                builder: (context, state) {
                  if (state is ButtonLoadingState) {
                    FocusScope.of(context).unfocus();
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
} 