import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter/material.dart';

class EditProfilePage extends StatelessWidget {
  const EditProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Edit Public Details',
        onBackPressed: () => Navigator.of(context).maybePop(),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Edit Profile Content'),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
