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
import 'package:edu_review_mobile/features/blog/presentation/bloc/publish_blog_cubit.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/publish_blog_state.dart';
import 'package:edu_review_mobile/features/blog/presentation/widgets/custom_tag_multi_select.widget.dart';
import 'package:edu_review_mobile/features/blog/presentation/widgets/richtext_editor.widget.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:markdown_quill/markdown_quill.dart';
import 'package:flutter_quill/flutter_quill.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http_parser/http_parser.dart';
import 'package:path/path.dart' as path;

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
  String get _contentPlainText => _quillController.document.toPlainText().trim();
  late final FocusNode _editorFocusNode;
  List<int> _selectedTagIds = [];

  String? _uploadedImageUrl;
  String? _featuredImage;
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
    if (_selectedTagIds.isEmpty) {
      _showSnackBar("Please select at least one tag");
      return;
    }
    if (_contentPlainText.length < 10) {
      _showSnackBar('Content must be at least 10 characters');
      return;
    }

    final markdownContent =
        DeltaToMarkdown().convert(_quillController.document.toDelta());

    final excerptText = _excerptController.text.trim();

    final blogParams = BlogParams(
      title: _titleController.text.trim(),
      content: markdownContent,
      category: 'other',
      excerpt: excerptText.isEmpty ? null : excerptText,
      featuredImage: _featuredImage,
      tagIds: _selectedTagIds,
    );

    cubit.saveBlog(blogParams);
  }

  void _publishBlog(PublishBlogCubit cubit) {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedTagIds.isEmpty) {
      _showSnackBar("Please select at least one tag");
      return;
    }
    if (_contentPlainText.length < 10) {
      _showSnackBar('Content must be at least 10 characters');
      return;
    }

    final markdownContent =
        DeltaToMarkdown().convert(_quillController.document.toDelta());

    final excerptText = _excerptController.text.trim();

    final blogParams = BlogParams(
      title: _titleController.text.trim(),
      content: markdownContent,
      category: 'other',
      excerpt: excerptText.isEmpty ? null : excerptText,
      featuredImage: _featuredImage,
      tagIds: _selectedTagIds,
    );

    cubit.publishBlog(blogParams);
  }

  Future<void> _pickAndUploadImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile == null) return;

    setState(() => _isUploadingImage = true);

    try {
      final ext = path.extension(pickedFile.path).toLowerCase();
      final mimeType = ext == '.png'
          ? MediaType('image', 'png')
          : MediaType('image', 'jpeg');

      final formData = FormData.fromMap({
        'image': await MultipartFile.fromFile(
          pickedFile.path,
          filename: path.basename(pickedFile.path),
          contentType: mimeType,
        ),
      });

      final result = await sl<UploadImageApiService>().uploadImage(formData);

      result.fold(
        (failure) => _showSnackBar(failure.message),
        (success) {
          setState(() => _uploadedImageUrl = success.secureUrl);
          setState(() => _featuredImage = success.publicId);
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

  void _showSuccessDialog(BuildContext context, String message) {
    showAppDialog(
      context: context,
      title: 'Success',
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

  void _showErrorDialog(BuildContext context, String title, String message) {
    showAppDialog(
      context: context,
      title: title,
      content: 'Error: $message',
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

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => CreateBlogCubit()),
        BlocProvider(create: (_) => PublishBlogCubit()),
      ],
      child: MultiBlocListener(
        listeners: [
          BlocListener<CreateBlogCubit, CreateBlogState>(
            listener: (context, state) {
              if (state is CreateBlogSuccess) {
                _showSuccessDialog(context, 'Create Blog successfully!');
              } else if (state is CreateBlogFailure) {
                _showErrorDialog(context, 'Create Blog Failed', state.errorMessage);
              }
            },
          ),
          BlocListener<PublishBlogCubit, PublishBlogState>(
            listener: (context, state) {
              if (state is PublishBlogSuccess) {
                _showSuccessDialog(context, 'Publish Blog successfully!');
              } else if (state is PublishBlogFailure) {
                _showErrorDialog(context, 'Publish Blog Failed', state.errorMessage);
              }
            },
          ),
        ],
        child: GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: BlocBuilder<CreateBlogCubit, CreateBlogState>(
            builder: (context, state) {
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
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Title is required';
                            }
                            if (value.trim().length < 5) {
                              return 'Title must be at least 5 characters';
                            }
                            if (value.trim().length > 255) {
                              return 'Title cannot exceed 255 characters';
                            }
                            return null; // hợp lệ
                          },
                        ),
                        const SizedBox(height: 16),
                        _buildLabel('Tags', context),
                        const SizedBox(height: 8),
                        CustomTagMultiSelect(
                          onTagsSelected: (ids) {
                            _selectedTagIds = ids;
                          },
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
                        Row(
                          children: [
                            Expanded(
                              child: BlocBuilder<CreateBlogCubit, CreateBlogState>(
                                builder: (context, state) {
                                  final isCreateLoading = state is CreateBlogLoading;
                                  return ElevatedButton(
                                    onPressed: isCreateLoading
                                        ? null
                                        : () => _submitBlog(
                                              context.read<CreateBlogCubit>(),
                                            ),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.secondaryGrey,
                                      minimumSize: const Size(double.infinity, 48),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    child: isCreateLoading
                                        ? const SizedBox(
                                            width: 20,
                                            height: 20,
                                            child: CircularProgressIndicator(
                                              strokeWidth: 2,
                                              valueColor: AlwaysStoppedAnimation<Color>(
                                                Colors.white,
                                              ),
                                            ),
                                          )
                                        : Row(
                                            mainAxisSize: MainAxisSize.min,
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              SvgPicture.asset(
                                                "assets/icons/ic_save.svg",
                                                color: AppColors.primaryBlack,
                                                width: 20,
                                                height: 20,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                'Save Blog',
                                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                                  color: AppColors.textBlack,
                                                  fontWeight: FontWeight.w900,
                                                ),
                                              ),
                                            ],
                                          ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: BlocBuilder<PublishBlogCubit, PublishBlogState>(
                                builder: (context, state) {
                                  final isPublishLoading = state is PublishBlogLoading;
                                  return ElevatedButton(
                                    onPressed: isPublishLoading
                                        ? null
                                        : () => _publishBlog(
                                              context.read<PublishBlogCubit>(),
                                            ),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.primaryBlue,
                                      minimumSize: const Size(double.infinity, 48),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    child: isPublishLoading
                                        ? const SizedBox(
                                            width: 20,
                                            height: 20,
                                            child: CircularProgressIndicator(
                                              strokeWidth: 2,
                                              valueColor: AlwaysStoppedAnimation<Color>(
                                                Colors.white,
                                              ),
                                            ),
                                          )
                                        : Row(
                                            mainAxisSize: MainAxisSize.min,
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              Text(
                                                'Publish',
                                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                                      color: AppColors.primaryWhite,
                                                      fontWeight: FontWeight.w900,
                                                    ),
                                              ),
                                              const SizedBox(width: 8),
                                              SvgPicture.asset(
                                                "assets/icons/ic_publish.svg",
                                                color: AppColors.primaryWhite,
                                                width: 20,
                                                height: 20,
                                              ),
                                            ],
                                          ),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),

                        SizedBox(height: 12)
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
