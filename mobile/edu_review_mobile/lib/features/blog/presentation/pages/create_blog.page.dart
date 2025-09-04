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
import 'package:edu_review_mobile/common/widgets/selector/custom_tag_multi_select.widget.dart';
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
      _showSnackBar("Vui lòng chọn ít nhất một thẻ");
      return;
    }
    if (_contentPlainText.length < 10) {
      _showSnackBar('Nội dung phải có ít nhất 10 ký tự');
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
      _showSnackBar("Vui lòng chọn ít nhất một thẻ");
      return;
    }
    if (_contentPlainText.length < 10) {
      _showSnackBar('Nội dung phải có ít nhất 10 ký tự');
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
          _showSnackBar('Tải ảnh thành công!');
        },
      );
    } catch (e) {
      _showSnackBar('Lỗi: $e');
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

  void _showErrorDialog(BuildContext context, String title, String message) {
    showAppDialog(
      context: context,
      title: title,
      content: 'Lỗi: $message',
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

  void _deleteImage() {
    setState(() {
      _uploadedImageUrl = null;
      _featuredImage = null;
    });
    _showSnackBar('Đã xóa ảnh');
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
                _showSuccessDialog(context, 'Tạo Blog thành công!');
              } else if (state is CreateBlogFailure) {
                _showErrorDialog(context, 'Tạo Blog thất bại', state.errorMessage);
              }
            },
          ),
          BlocListener<PublishBlogCubit, PublishBlogState>(
            listener: (context, state) {
              if (state is PublishBlogSuccess) {
                _showSuccessDialog(context, 'Đăng tải Blog thành công!');
              } else if (state is PublishBlogFailure) {
                _showErrorDialog(context, 'Đăng tải Blog thất bại', state.errorMessage);
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
                  title: 'Tạo Blog',
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
                        _buildLabel('Tiêu đề', context),
                        const SizedBox(height: 8),
                        CustomTextField(
                          controller: _titleController,
                          placeholder: 'Nhập tiêu đề',
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Tiêu đề là bắt buộc';
                            }
                            if (value.trim().length < 5) {
                              return 'Tiêu đề phải có ít nhất 5 ký tự';
                            }
                            if (value.trim().length > 255) {
                              return 'Tiêu đề không được vượt quá 255 ký tự';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        _buildLabel('Thẻ', context),
                        const SizedBox(height: 8),
                        CustomTagMultiSelect(
                          onTagsSelected: (ids) {
                            _selectedTagIds = ids;
                          },
                        ),
                        const SizedBox(height: 16),
                        _buildLabel('Tóm tắt', context),
                        const SizedBox(height: 8),
                        CustomTextField(
                          controller: _excerptController,
                          placeholder: 'Tóm tắt ngắn (không bắt buộc)',
                          maxLines: 3,
                        ),
                        const SizedBox(height: 16),
                        _buildLabel('Ảnh nổi bật', context),
                        const SizedBox(height: 8),
                        CustomImagePicker(
                          imageUrl: _uploadedImageUrl,
                          isUploading: _isUploadingImage,
                          onTap: _pickAndUploadImage,
                          onDelete: _deleteImage,
                        ),
                        const SizedBox(height: 16),
                        _buildLabel('Nội dung', context),
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
                                              Text(
                                                'Lưu',
                                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                                  color: AppColors.textBlack,
                                                  fontWeight: FontWeight.w900,
                                                ),
                                              ),
                                              const SizedBox(width: 8),
                                              SvgPicture.asset(
                                                AppIcons.save,
                                                color: AppColors.primaryBlack,
                                                width: 20,
                                                height: 20,
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
                                                'Đăng tải',
                                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                                      color: AppColors.primaryWhite,
                                                      fontWeight: FontWeight.w900,
                                                    ),
                                              ),
                                              const SizedBox(width: 8),
                                              SvgPicture.asset(
                                                AppIcons.publish,
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
      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
        fontFamily: 'Roboto-Bold',
        color: AppColors.textBlack,
      ),
    );
  }
}
