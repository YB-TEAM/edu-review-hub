import 'package:dio/dio.dart';
import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common/widgets/picker/image_picker.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common/widgets/selector/custom_tag_multi_select.widget.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/core/services/image_uploader_service.dart';
import 'package:edu_review_mobile/features/blog/presentation/widgets/richtext_editor.widget.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_edit_params.dart';
import 'package:edu_review_mobile/features/user_profile/data/models/blog_response.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/blog/edit_blog_cubit.dart';
import 'package:edu_review_mobile/features/user_profile/presentation/bloc/blog/edit_blog_state.dart';
import 'package:edu_review_mobile/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_quill/flutter_quill.dart' as quill;
import 'package:flutter_svg/svg.dart';
import 'package:image_picker/image_picker.dart';
import 'package:markdown_quill/markdown_quill.dart';
import 'package:markdown/markdown.dart' as md;
import 'package:http_parser/http_parser.dart';
import 'package:path/path.dart' as path;

class EditBlogPage extends StatefulWidget {
  final BlogResponse blog;
  const EditBlogPage({super.key, required this.blog});

  @override
  State<EditBlogPage> createState() => _EditBlogPageState();
}

class _EditBlogPageState extends State<EditBlogPage> {
  late TextEditingController _titleController;
  late TextEditingController _excerptController;
  late quill.QuillController _quillController;
  late FocusNode _editorFocusNode;
  List<int> _selectedTagIds = [];

  String? _featuredImagePublicId; 
  String? _featuredImageURL;
  bool _isUploadingImage = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.blog.title);
    _excerptController = TextEditingController(text: widget.blog.excerpt ?? '');
    _editorFocusNode = FocusNode();
    _selectedTagIds = widget.blog.tags?.map((e) => e.id).toList() ?? [];
    _featuredImagePublicId = null;
    _featuredImageURL = widget.blog.featuredImageUrl;

    final markdownContent = widget.blog.content;
    final markdownDocument = md.Document();
    final delta =
        MarkdownToDelta(markdownDocument: markdownDocument).convert(markdownContent);

    _quillController = quill.QuillController(
      document: quill.Document.fromDelta(delta),
      selection: const TextSelection.collapsed(offset: 0),
    );
  }

  @override
  void dispose() {
    _titleController.dispose();
    _excerptController.dispose();
    _quillController.dispose();
    _editorFocusNode.dispose();
    super.dispose();
  }

  String get _contentPlainText => _quillController.document.toPlainText().trim();

  void _submitBlog(EditBlogCubit cubit) {
    if (_titleController.text.trim().isEmpty) return;
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

    final editBlogParams = EditBlogParams(
      blogId: widget.blog.id,
      title: _titleController.text.trim(),
      content: markdownContent,
      category: 'other',
      status: 'draft',
      excerpt: _excerptController.text.trim().isEmpty
          ? null
          : _excerptController.text.trim(),
      featuredImage: _featuredImagePublicId ?? widget.blog.featuredImage,
      tagIds: _selectedTagIds,
    );
    cubit.editBlog(editBlogParams);
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  void _showSuccessDialog(String message) {
    showAppDialog(
      context: context,
      title: 'Success',
      content: message,
      icon: Icons.check_circle,
      iconColor: Colors.green,
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('OK'),
        ),
      ],
    );
  }

  void _showErrorDialog(String title, String message) {
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

  Future<void> _uploadImage(XFile pickedFile) async {
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
          setState(() {
            _featuredImagePublicId = success.publicId;
            _featuredImageURL = success.secureUrl;
          });
          _showSnackBar('Image uploaded successfully!');
        },
      );
    } catch (e) {
      _showSnackBar('Error: $e');
    } finally {
      setState(() => _isUploadingImage = false);
    }
  }

  void _deleteImage() {
    setState(() {
      _featuredImagePublicId = null;
      _featuredImageURL = null;
    });
    _showSnackBar('Image deleted');
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => EditBlogCubit(),
      child: BlocListener<EditBlogCubit, EditBlogState>(
        listener: (context, state) {
          if (state is EditBlogSuccess) {
            _showSuccessDialog('Blog updated successfully!');
          } else if (state is EditBlogFailure) {
            _showErrorDialog('Update Failed', state.errorMessage);
          }
        },
        child: Scaffold(
          appBar: CustomAppBar(
            title: 'Edit Blog',
            onBackPressed: () => Navigator.of(context).maybePop(),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildLabel('Title'),
                const SizedBox(height: 8),
                CustomTextField(
                  controller: _titleController,
                  placeholder: 'Enter title',
                ),
                const SizedBox(height: 16),
                _buildLabel('Tags'),
                const SizedBox(height: 8),
                CustomTagMultiSelect(
                  initialTagIds: _selectedTagIds,
                  onTagsSelected: (ids) => _selectedTagIds = ids,
                ),
                const SizedBox(height: 16),
                _buildLabel('Excerpt'),
                const SizedBox(height: 8),
                CustomTextField(
                  controller: _excerptController,
                  placeholder: 'Short summary (optional)',
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                _buildLabel('Featured Image'),
                const SizedBox(height: 8),
                CustomImagePicker(
                  imageUrl: _featuredImageURL,
                  isUploading: _isUploadingImage,
                  onTap: () async {
                    final pickedFile =
                        await ImagePicker().pickImage(source: ImageSource.gallery);
                    if (pickedFile != null) {
                      await _uploadImage(pickedFile);
                    }
                  },
                  onDelete: _deleteImage,
                ),
                const SizedBox(height: 16),
                _buildLabel('Content'),
                const SizedBox(height: 8),
                CustomRichTextField(
                  controller: _quillController,
                  focusNode: _editorFocusNode,
                ),
                const SizedBox(height: 20),
                BlocBuilder<EditBlogCubit, EditBlogState>(
                  builder: (context, state) {
                    final isLoading = state is EditBlogLoading;
                    return ElevatedButton(
                      onPressed: isLoading
                          ? null
                          : () => _submitBlog(context.read<EditBlogCubit>()),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.secondaryGrey,
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
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : Row(
                              mainAxisSize: MainAxisSize.min,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Save',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyLarge
                                      ?.copyWith(
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
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
        fontFamily: 'Roboto-Bold',
        color: AppColors.textBlack,
      ),
    );
  }
}
