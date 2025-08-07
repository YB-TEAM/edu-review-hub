import 'package:edu_review_mobile/common_libs.dart';
import 'package:flutter_quill/flutter_quill.dart';

class CustomRichTextField extends StatefulWidget {
  final QuillController controller;
  final FocusNode focusNode; 
  final String label;
  final double editorHeight;

  const CustomRichTextField({
    super.key,
    required this.controller,
    required this.focusNode,
    this.label = 'Content',
    this.editorHeight = 300,
  });

  @override
  State<CustomRichTextField> createState() => _CustomRichTextFieldState();
}

class _CustomRichTextFieldState extends State<CustomRichTextField> {

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.primaryWhite,
        border: Border.all(color: AppColors.secondaryGrey, width: 1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          QuillSimpleToolbar(
            controller: widget.controller,
            config: QuillSimpleToolbarConfig(
              showUndo: true,
              showRedo: true,
              showFontFamily: false,
              showFontSize: false,
              showHeaderStyle: false,
              multiRowsDisplay: false,
              toolbarIconAlignment: WrapAlignment.start,
              decoration: BoxDecoration(
                color: AppColors.backgroundGrey,
                border: Border(
                  bottom: BorderSide(color: AppColors.secondaryGrey, width: 1),
                ),
                borderRadius: const BorderRadius.only(
                  topRight: Radius.circular(8),
                  topLeft: Radius.circular(8),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: widget.editorHeight,
            child: QuillEditor.basic(
              focusNode: widget.focusNode,
              controller: widget.controller,
              config: const QuillEditorConfig(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                autoFocus: false,
                expands: false,
                scrollable: true,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
