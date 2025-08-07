// ignore_for_file: depend_on_referenced_packages

import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common/widgets/dialog/custom_dialog.dart';
import 'package:edu_review_mobile/common/widgets/text_field/custom_text_field.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/create_blog_cubit.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/create_blog_state.dart';
import 'package:edu_review_mobile/features/blog/presentation/widgets/richtext_editor.widget.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:markdown_quill/markdown_quill.dart';
import 'package:flutter_quill/flutter_quill.dart';

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

    final markdownContent = DeltaToMarkdown().convert(_quillController.document.toDelta());

    final excerptText = _excerptController.text.trim();
    
    final blogParams = BlogParams(
      title: _titleController.text.trim(),
      content: markdownContent,
      category: 'other',
      excerpt: excerptText.isEmpty ? null : excerptText,
    );

    cubit.createBlog(blogParams);
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
                      if (mounted) {
                        Navigator.of(context).pop();
                      }
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
            onTap: () {
              FocusScope.of(context).unfocus();
            },
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
                        Text(
                          'Title', 
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        CustomTextField(
                          controller: _excerptController,
                          placeholder: 'Enter title',
                        ),
                        const SizedBox(height: 16),

                        Text(
                          'Excerpt', 
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        CustomTextField(
                          controller: _titleController,
                          placeholder: 'Short summary (optional)',
                          maxLines: 3,
                        ),
                        const SizedBox(height: 16),

                        Text(
                          'Content', 
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        CustomRichTextField(controller: _quillController, focusNode: _editorFocusNode,),
                        const SizedBox(height: 32),
                        ElevatedButton(
                          onPressed: state is CreateBlogLoading ? null : () => _submitBlog(context.read<CreateBlogCubit>()),
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            backgroundColor: Colors.blueAccent,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: state is CreateBlogLoading
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                  ),
                                )
                              : const Text('Publish Blog', style: TextStyle(fontSize: 16)),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }
          )
        ),
      ),
    );
  }
}
