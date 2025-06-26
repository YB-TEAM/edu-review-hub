import 'package:edu_review_mobile/common/widgets/button/custom_text_button.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_password_field.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: SingleChildScrollView(
          padding: EdgeInsets.fromLTRB(30, 140, 30, 0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children:[
              Text(
                'Sign in now',
                style: Theme.of(context).textTheme.headlineLarge,
              ),
              SizedBox(height: 16),
              Text(
                'Please sign in to continue using our app',
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
                      placeholder: 'Email',
                      controller: _emailController,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter the email';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 16),
                    CustomPasswordField(
                      controller: _passwordController,
                    ),
                    Align(
                      alignment: Alignment.centerRight,
                      child: CustomTextButton(
                        onPressed: () {
                          
                        },
                        title: "Forgot Password?",
                      ),
                    ),
                    SizedBox(height: 30),
                    PrimaryButton(
                      title: "Sign In",
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          
                        }
                      }
                    ),
                    SizedBox(height: 40),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Don't have an account?",
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textGrey,
                          ),
                        ),
                        CustomTextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, RouteConstant.signUp);
                          },
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
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}