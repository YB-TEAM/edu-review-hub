import 'package:edu_review_mobile/common/widgets/button/custom_text_button.dart';
import 'package:edu_review_mobile/common/widgets/button/primary_button.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_password_field.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final TextEditingController _usernameController = TextEditingController();
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
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter the username';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 16),
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
                      controller: _passwordController,
                    ),
                    SizedBox(height: 30),
                    PrimaryButton(
                      title: "Sign Up",
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
                          "Already have an account?",
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textGrey,
                          ),
                        ),
                        CustomTextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, RouteConstant.signIn);
                          },
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