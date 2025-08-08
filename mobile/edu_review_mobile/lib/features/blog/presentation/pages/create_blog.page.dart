// ignore_for_file: depend_on_referenced_packages
import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common/widgets/picker/image_picker.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/services/image_uploader_service.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/create_blog_cubit.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/create_blog_state.dart';
import 'package:edu_review_mobile/features/blog/presentation/widgets/richtext_editor.widget.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:markdown_quill/markdown_quill.dart';
import 'package:flutter_quill/flutter_quill.dart';
import 'package:image_picker/image_picker.dart';

class CreateBlogPage extends StatefulWidget {
  const CreateBlogPage({super.key});

  @override
  State<CreateBlogPage> createState() => _CreateBlogPageState();
}

class _CreateBlogPageState extends State<CreateBlogPage> {
  final _titleController = TextEditingController();
  final _excerptController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  late QuillController _quillController;
  late final FocusNode _editorFocusNode;

  String? _uploadedImageUrl;
  bool _isUploadingImage = false;

  @override
  void initState() {
    super.initState();
    _quillController = QuillController.basic();
    _editorFocusNode = FocusNode();
  }

  @override
  void dispose() {
    _editorFocusNode.dispose();
    _titleController.dispose();
    _excerptController.dispose();
    _quillController.dispose();
    super.dispose();
  }

  void _submitBlog(CreateBlogCubit cubit) {
    if (!_formKey.currentState!.validate()) return;

    final markdownContent =
        DeltaToMarkdown().convert(_quillController.document.toDelta());

    final excerptText = _excerptController.text.trim();

    final blogParams = BlogParams(
      title: _titleController.text.trim(),
      content: markdownContent,
      category: 'other',
      excerpt: excerptText.isEmpty ? null : excerptText,
    );

    cubit.createBlog(blogParams);
  }

  Future<void> _pickAndUploadImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile == null) return;

    setState(() => _isUploadingImage = true);

    try {
      final formData = FormData.fromMap({
        'image': await MultipartFile.fromFile(
          pickedFile.path,
          filename: pickedFile.name,
        ),
      });

      final result =
          await sl<UploadImageApiService>().uploadImage(formData);

      result.fold(
        (failure) => _showSnackBar(failure.message),
        (success) {
          setState(() => _uploadedImageUrl = success.secureUrl);
          _showSnackBar('Image uploaded successfully!');
        },
      );
    } catch (e) {
      _showSnackBar('Error: $e');
    }

    setState(() => _isUploadingImage = false);
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CreateBlogCubit(),
      child: BlocListener<CreateBlogCubit, CreateBlogState>(
        listener: (context, state) {
          if (state is CreateBlogSuccess) {
            showAppDialog(
              context: context,
              title: 'Success',
              content: 'Create Blog successfully!',
              icon: Icons.check_circle,
              iconColor: Colors.green,
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      if (mounted) Navigator.of(context).pop();
                    });
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          } else if (state is CreateBlogFailure) {
            showAppDialog(
              context: context,
              title: 'Create Blog Failed',
              content: 'Error: ${state.errorMessage}',
              icon: Icons.error,
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
          onTap: () => FocusScope.of(context).unfocus(),
          child: BlocBuilder<CreateBlogCubit, CreateBlogState>(
            builder: (context, state) {
              final isLoading = state is CreateBlogLoading;
              return Scaffold(
                appBar: CustomAppBar(
                  title: 'Create Blog',
                  onBackPressed: () => Navigator.of(context).maybePop(),
                ),
                backgroundColor: AppColors.primaryWhite,
                body: SingleChildScrollView(
                  padding: const EdgeInsets.all(12),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _buildLabel('Title', context),
                        const SizedBox(height: 8),
                        CustomTextField(
                          controller: _titleController,
                          placeholder: 'Enter title',
                        ),
                        const SizedBox(height: 16),
                        _buildLabel('Excerpt', context),
                        const SizedBox(height: 8),
                        CustomTextField(
                          controller: _excerptController,
                          placeholder: 'Short summary (optional)',
                          maxLines: 3,
                        ),
                        const SizedBox(height: 16),
                        _buildLabel('Featured Image', context),
                        const SizedBox(height: 8),
                        CustomImagePicker(
                          imageUrl: _uploadedImageUrl,
                          isUploading: _isUploadingImage,
                          onTap: _pickAndUploadImage,
                        ),
                        const SizedBox(height: 16),
                        _buildLabel('Content', context),
                        const SizedBox(height: 8),
                        CustomRichTextField(
                          controller: _quillController,
                          focusNode: _editorFocusNode,
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: isLoading
                              ? null
                              : () => _submitBlog(
                                    context.read<CreateBlogCubit>(),
                                  ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryBlue,
                            minimumSize:
                                const Size(double.infinity, 48),
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
                                    valueColor:
                                        AlwaysStoppedAnimation<Color>(
                                            Colors.white),
                                  ),
                                )
                              : Row(
                                  mainAxisSize: MainAxisSize.min,
                                  mainAxisAlignment:
                                      MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      'Save',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyLarge
                                          ?.copyWith(
                                            color:
                                                AppColors.primaryWhite,
                                            fontWeight: FontWeight.w600,
                                          ),
                                    ),
                                    const SizedBox(width: 8),
                                    SvgPicture.asset(
                                      "assets/icons/ic_send.svg",
                                      color: AppColors.primaryWhite,
                                      width: 20,
                                      height: 20,
                                    ),
                                  ],
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

  Widget _buildLabel(String text, BuildContext context) {
    return Text(
      text,
      style: Theme.of(context)
          .textTheme
          .bodyLarge
          ?.copyWith(fontWeight: FontWeight.w600),
    );
  }
}
