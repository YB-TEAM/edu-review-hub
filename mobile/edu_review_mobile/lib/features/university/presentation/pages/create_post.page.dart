// ignore_for_file: depend_on_referenced_packages

import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common/widgets/combobox/custom_combobox.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/university/data/models/review_params.dart';
import 'package:edu_review_mobile/features/university/data/models/review_score_params.dart';
import 'package:edu_review_mobile/features/university/presentation/bloc/create_review_state.dart';
import 'package:edu_review_mobile/features/university/presentation/bloc/create_review_cubit.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';

class CreatePostPage extends StatefulWidget {
  final int universityId;
  const CreatePostPage({super.key, required this.universityId});

  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  final _formKey = GlobalKey<FormState>();

  final _contentController = TextEditingController();
  final _prosController = TextEditingController();
  final _consController = TextEditingController();
  final _recommendationController = TextEditingController();
  final _studyProgramController = TextEditingController();
  final _studyYearController = TextEditingController();
  final _graduationYearController = TextEditingController();
  final _scoresController = TextEditingController();

  final List<ReviewScoreParams> _criterionScores = [
    ReviewScoreParams(criterionId: 1, score: 4),
    ReviewScoreParams(criterionId: 2, score: 5),
    ReviewScoreParams(criterionId: 3, score: 3),
  ];

  double _overallScore = 5;
  bool _isAnonymous = false;
  String _reviewType = 'Sinh viên';

  final Map<String, String> _reviewTypeMap = {
    'Sinh viên': 'student',
    'Cựu sinh viên': 'alumni',
    'Phụ huynh': 'parent',
    'Khách tham quan': 'visitor',
    'Nhân viên': 'staff',
  };

  void _submitReview(BuildContext context, CreateReviewCubit cubit) {
    if (!_formKey.currentState!.validate()) return;

    final params = ReviewParams(
      universityId: widget.universityId,
      content: _contentController.text.trim(),
      pros: _prosController.text.trim(),
      cons: _consController.text.trim(),
      recommendation: _recommendationController.text.trim(),
      overallScore: _overallScore,
      reviewType: _reviewTypeMap[_reviewType] ?? '',
      studyProgram: _studyProgramController.text.trim(),
      studyYear: int.tryParse(_studyYearController.text),
      graduationYear: int.tryParse(_graduationYearController.text),
      isAnonymous: _isAnonymous,
      scores: _criterionScores,
    );
    cubit.createReview(params);
  }


  void _showSuccessDialog(BuildContext context, String message) {
    showAppDialog(
      context: context,
      title: 'Thành công',
      content: message,
      icon: Icons.check_circle,
      iconColor: Colors.green,
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (context.mounted) Navigator.of(context).pop();
            });
          },
          child: const Text('OK'),
        ),
      ],
    );
  }

  void _showErrorDialog(BuildContext context, String message) {
    showAppDialog(
      context: context,
      title: 'Thất bại',
      content: message,
      icon: Icons.error,
      iconColor: Colors.red,
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Đóng'),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CreateReviewCubit(),
      child: BlocListener<CreateReviewCubit, CreateReviewState>(
        listener: (context, state) {
          if (state is CreateReviewSuccess) {
            _showSuccessDialog(context, "Tạo đánh giá thành công!");
          } else if (state is CreateReviewFailure) {
            _showErrorDialog(context, state.errorMessage);
          }
        },
        child: GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: BlocBuilder<CreateReviewCubit, CreateReviewState>(
            builder: (context, state) {
              final isLoading = state is CreateReviewLoading;

              return Scaffold(
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

                        Text(
                          "Điểm tổng quan: ${_overallScore.toStringAsFixed(1)}",
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                fontFamily: 'Roboto-Bold',
                                color: AppColors.textBlack,
                              ),
                        ),
                        Slider(
                          padding: EdgeInsets.symmetric(horizontal: 0, vertical: 12),
                          activeColor: AppColors.primaryBlue,
                          value: _overallScore,
                          min: 1,
                          max: 5,
                          divisions: 4,
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
                          items: _reviewTypeMap.keys.toList(),
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
                          placeholder: "Ví dụ: 3",
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
                          label: "Điểm chi tiết *",
                          placeholder: "{study: 8, facility: 7, activity: 9}",
                          controller: _scoresController,
                        ),
                        const SizedBox(height: 16),

                        Row(
                          children: [
                            Checkbox(
                              activeColor: AppColors.primaryBlue,
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
                            onPressed: isLoading
                                ? null
                                : () => _submitReview(
                                      context,
                                      context.read<CreateReviewCubit>(),
                                    ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primaryBlue,
                              minimumSize: const Size(double.infinity, 48),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : Row(
                                    mainAxisSize: MainAxisSize.min,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        'Tạo đánh giá',
                                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                              color: AppColors.primaryWhite,
                                              fontWeight: FontWeight.w900,
                                            ),
                                      ),
                                      const SizedBox(width: 8),
                                      
                                      SvgPicture.asset(
                                        AppIcons.publish,
                                        width: 20,
                                        height: 20,
                                        colorFilter: const ColorFilter.mode(
                                          Colors.white,
                                          BlendMode.srcIn,
                                        ),
                                      ),
                                    ],
                                  ),
                          ),
                        ),

                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
