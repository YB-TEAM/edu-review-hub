// ignore_for_file: depend_on_referenced_packages

import 'package:edu_review_mobile/common/widgets/appbar/custom_appbar.dart';
import 'package:edu_review_mobile/common_libs.dart';
import 'package:edu_review_mobile/features/blog/data/models/blog_params.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/create_blog_cubit.dart';
import 'package:edu_review_mobile/features/blog/presentation/bloc/create_blog_state.dart';
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

  @override
  void initState() {
    super.initState();
    _quillController = QuillController.basic();
  }

  @override
  void dispose() {
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
            Navigator.pop(context);
          } else if (state is CreateBlogFailure) {
            showDialog(
              context: context,
              builder: (_) => AlertDialog(
                title: const Text('Error'),
                content: Text(state.errorMessage),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('OK'),
                  ),
                ],
              ),
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
                backgroundColor: const Color(0xFFF7F8FA),
                body: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _buildSectionTitle('Title'),
                        _buildTextField(_titleController, 'Enter blog title'),
                        const SizedBox(height: 20),
                        _buildSectionTitle('Excerpt'),
                        _buildTextField(_excerptController, 'Short summary (optional)', maxLines: 3, required: false),
                        const SizedBox(height: 20),
                        _buildSectionTitle('Content'),
                        _buildRichEditor(),
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

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w700,
        color: Colors.black87,
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint,
    {int maxLines = 1, bool required = true}) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(
        hintText: hint,
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
      ),
      validator: (value) {
        if (required && (value == null || value.trim().isEmpty)) {
          return 'This field is required';
        }
        return null;
      },
    );
  }


  Widget _buildRichEditor() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(12),
          ),
          child: QuillSimpleToolbar(
            controller: _quillController,
            config: const QuillSimpleToolbarConfig(
              showUndo: true,
              showRedo: true,
              multiRowsDisplay: false,
              toolbarIconAlignment: WrapAlignment.start,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Container(
          height: 300,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(12),
          ),
          child: QuillEditor.basic(
            controller: _quillController,
            config: const QuillEditorConfig(
              placeholder: 'Write your blog content here...',
              autoFocus: false,
              expands: false,
              scrollable: true,
              padding: EdgeInsets.zero,
            ),
          ),
        ),
      ],
    );
  }
}
