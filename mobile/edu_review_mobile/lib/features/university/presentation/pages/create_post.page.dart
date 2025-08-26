import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common/widgets/combobox/custom_combobox.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter/material.dart';

class CreatePostPage extends StatefulWidget {
  final int universityId;
  const CreatePostPage({super.key, required this.universityId});

  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _contentController = TextEditingController();
  final TextEditingController _prosController = TextEditingController();
  final TextEditingController _consController = TextEditingController();
  final TextEditingController _recommendationController = TextEditingController();
  final TextEditingController _studyProgramController = TextEditingController();
  final TextEditingController _studyYearController = TextEditingController();
  final TextEditingController _graduationYearController = TextEditingController();
  final TextEditingController _scoresController = TextEditingController();

  double _overallScore = 5;
  bool _isAnonymous = false;
  String _reviewType = 'Học tập';

  final List<String> _reviewTypes = [
    'Học tập',
    'Cơ sở vật chất',
    'Hoạt động ngoại khóa',
    'Khác'
  ];

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        appBar: CustomAppBar(
          title: 'Tạo bài viết',
          showBackButton: true,
          onBackPressed: () => Navigator.of(context).pop(),
        ),
        body: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CustomTextField(
                  label: "Nội dung *",
                  placeholder: "Nhập nội dung đánh giá",
                  controller: _contentController,
                  maxLines: 4,
                  validator: (value) =>
                      value == null || value.isEmpty ? 'Vui lòng nhập nội dung' : null,
                ),
                const SizedBox(height: 16),
      
                CustomTextField(
                  label: "Ưu điểm",
                  placeholder: "Nhập ưu điểm",
                  controller: _prosController,
                  maxLines: 2,
                ),
                const SizedBox(height: 16),
      
                CustomTextField(
                  label: "Nhược điểm",
                  placeholder: "Nhập nhược điểm",
                  controller: _consController,
                  maxLines: 2,
                ),
                const SizedBox(height: 16),
      
                CustomTextField(
                  label: "Khuyến nghị",
                  placeholder: "Nhập khuyến nghị",
                  controller: _recommendationController,
                ),
                const SizedBox(height: 16),
      
                Text("Điểm tổng quan: ${_overallScore.toStringAsFixed(1)}", 
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontFamily: 'Roboto-Bold',
                    color: AppColors.textBlack,
                  ),
                ),
                Slider(
                  padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 8),
                  activeColor: AppColors.primaryBlue,
                  value: _overallScore,
                  min: 0,
                  max: 10,
                  divisions: 20,
                  label: _overallScore.toStringAsFixed(1),
                  onChanged: (value) {
                    setState(() => _overallScore = value);
                  },
                ),
                const SizedBox(height: 16),
      
                CustomComboBox<String>(
                  label: "Loại đánh giá *",
                  placeholder: "Chọn loại",
                  value: _reviewType,
                  items: _reviewTypes,
                  itemLabel: (e) => e,
                  onChanged: (val) => setState(() => _reviewType = val ?? _reviewType),
                  validator: (val) =>
                      val == null || val.isEmpty ? "Vui lòng chọn loại đánh giá" : null,
                ),

                const SizedBox(height: 16),
      
                CustomTextField(
                  label: "Chương trình học",
                  placeholder: "Ví dụ: Công nghệ thông tin",
                  controller: _studyProgramController,
                ),
                const SizedBox(height: 16),
      
                CustomTextField(
                  label: "Năm học",
                  placeholder: "Ví dụ: 2022",
                  controller: _studyYearController,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
      
                CustomTextField(
                  label: "Năm tốt nghiệp",
                  placeholder: "Ví dụ: 2026",
                  controller: _graduationYearController,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
      
                CustomTextField(
                  label: "Điểm chi tiết  *",
                  placeholder: "{study: 8, facility: 7, activity: 9}",
                  controller: _scoresController,
                ),
                const SizedBox(height: 16),
      
                Row(
                  children: [
                    Checkbox(
                      value: _isAnonymous,
                      onChanged: (val) {
                        setState(() {
                          _isAnonymous = val ?? false;
                        });
                      },
                    ),
                    const Text("Đăng ẩn danh"),
                  ],
                ),
                const SizedBox(height: 24),
      
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      if (_formKey.currentState?.validate() ?? false) {
                        final reviewData = {
                          "university_id": widget.universityId,
                          "content": _contentController.text,
                          "pros": _prosController.text,
                          "cons": _consController.text,
                          "recommendation": _recommendationController.text,
                          "overall_score": _overallScore,
                          "review_type": _reviewType,
                          "study_program": _studyProgramController.text,
                          "study_year": _studyYearController.text,
                          "graduation_year": _graduationYearController.text,
                          "is_anonymous": _isAnonymous,
                          "scores": _scoresController.text,
                        };
                        debugPrint("Review data: $reviewData");
                      }
                    },
                    child: const Text("Đăng bài viết"),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
