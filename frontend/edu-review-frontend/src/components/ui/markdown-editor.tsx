"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Code, 
  ChevronDown,
  Type
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dynamic import for better performance
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg border border-gray-200 dark:border-gray-700" />
  ),
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Viết nội dung bài viết của bạn...",
  height = 500,
  className = "",
}: MarkdownEditorProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentHeading, setCurrentHeading] = useState<string>("H1");
  const [currentListType, setCurrentListType] = useState<string>("List");
  const editorRef = useRef<any>(null);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update current heading and list type based on cursor position
  const updateCurrentFormatting = useCallback(() => {
    if (editorRef.current && editorRef.current.textarea) {
      const textarea = editorRef.current.textarea;
      const start = textarea.selectionStart;
      const text = value;
      
      // Find current line boundaries more accurately
      let lineStart = 0;
      let lineEnd = text.length;
      
      // Find the start of the current line
      for (let i = start; i >= 0; i--) {
        if (text[i] === '\n') {
          lineStart = i + 1;
          break;
        }
      }
      
      // Find the end of the current line
      for (let i = start; i < text.length; i++) {
        if (text[i] === '\n') {
          lineEnd = i;
          break;
        }
      }
      
      const currentLineText = text.substring(lineStart, lineEnd).trim();
      
      // Check for heading
      if (currentLineText.startsWith('#')) {
        const headingLevel = currentLineText.match(/^#+/)?.[0].length || 0;
        if (headingLevel >= 1 && headingLevel <= 6) {
          setCurrentHeading(`H${headingLevel}`);
        } else {
          setCurrentHeading("H1");
        }
      } else {
        setCurrentHeading("H1");
      }
      
      // Check for list
      if (currentLineText.startsWith('- ') || currentLineText.startsWith('* ')) {
        setCurrentListType("Bulleted");
      } else if (currentLineText.match(/^\d+\.\s/)) {
        setCurrentListType("Numbered");
      } else {
        setCurrentListType("List");
      }
    }
  }, [value]);

  // Debounced version to reduce lag
  const debouncedUpdateFormatting = useCallback(() => {
    const timeoutId = setTimeout(updateCurrentFormatting, 100);
    return () => clearTimeout(timeoutId);
  }, [updateCurrentFormatting]);

  // Memoized change handler for better performance
  const handleChange = useCallback(
    (val?: string) => {
      onChange(val);
      // Update formatting state after change with debounce
      debouncedUpdateFormatting();
    },
    [onChange, debouncedUpdateFormatting]
  );

  // Auto-close markdown markers when typing
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Auto-close bold, italic, and code markers
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
      const textarea = e.currentTarget;
      const cursorPos = textarea.selectionStart;
      const text = value;
      
      // Check if we need to auto-close a markdown marker
      const beforeCursor = text.substring(0, cursorPos);
      const lastChar = beforeCursor.charAt(beforeCursor.length - 1);
      
      // If the last character is a markdown marker, auto-close it
      if (lastChar === '*' || lastChar === '`') {
        let closingMarker = '';
        if (lastChar === '*') {
          // Check if it's bold or italic
          const beforeLastChar = beforeCursor.charAt(beforeCursor.length - 2);
          if (beforeLastChar === '*') {
            closingMarker = '**';
          } else {
            closingMarker = '*';
          }
        } else if (lastChar === '`') {
          closingMarker = '`';
        }
        
        if (closingMarker) {
          // Insert closing marker
          const newText = text.substring(0, cursorPos) + closingMarker + text.substring(cursorPos);
          onChange(newText);
          
          // Set cursor position after the closing marker
          setTimeout(() => {
            if (editorRef.current && editorRef.current.textarea) {
              const newCursorPos = cursorPos + closingMarker.length;
              editorRef.current.textarea.setSelectionRange(newCursorPos, newCursorPos);
              editorRef.current.textarea.focus();
            }
          }, 0);
        }
      }
    }
  }, [value, onChange]);



  // Insert text at cursor position
  const insertAtCursor = useCallback((before: string, after: string = '') => {
    if (editorRef.current) {
      const textarea = editorRef.current.textarea;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = value;
        
        // If there's selected text, wrap it with before/after
        if (start !== end) {
          const selectedText = text.substring(start, end);
          const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
          onChange(newText);
          
          // Set cursor position after the wrapped text
          setTimeout(() => {
            if (editorRef.current && editorRef.current.textarea) {
              const newCursorPos = start + before.length + selectedText.length + after.length;
              editorRef.current.textarea.setSelectionRange(newCursorPos, newCursorPos);
              editorRef.current.textarea.focus();
            }
          }, 0);
        } else {
          // If no text is selected, handle line-level operations
          const lineStart = text.lastIndexOf('\n', start) + 1;
          const lineEnd = text.indexOf('\n', start);
          const lineEndPos = lineEnd === -1 ? text.length : lineEnd;
          const currentLineText = text.substring(lineStart, lineEndPos);
          
          // For heading operations
          if (before.startsWith('#') && after === '') {
            // Remove existing heading if present
            const cleanLineText = currentLineText.replace(/^#+\s*/, '');
            const newText = text.substring(0, lineStart) + before + ' ' + cleanLineText + text.substring(lineEndPos);
            onChange(newText);
            
            // Set cursor position after the heading
            setTimeout(() => {
              if (editorRef.current && editorRef.current.textarea) {
                const newCursorPos = lineStart + before.length + 1; // +1 for space
                editorRef.current.textarea.setSelectionRange(newCursorPos, newCursorPos);
                editorRef.current.textarea.focus();
              }
            }, 0);
          }
          // For list operations
          else if (before === '- ' || before === '1. ') {
            // Remove existing list marker if present
            const cleanLineText = currentLineText.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '');
            const newText = text.substring(0, lineStart) + before + cleanLineText + text.substring(lineEndPos);
            onChange(newText);
            
            // Set cursor position after the list marker
            setTimeout(() => {
              if (editorRef.current && editorRef.current.textarea) {
                const newCursorPos = lineStart + before.length;
                editorRef.current.textarea.setSelectionRange(newCursorPos, newCursorPos);
                editorRef.current.textarea.focus();
              }
            }, 0);
          }
          // For bold/italic/code operations (inline formatting)
          else if ((before === '**' && after === '**') || 
                   (before === '*' && after === '*') || 
                   (before === '`' && after === '`')) {
            // For inline formatting without selection, insert opening marker and place cursor
            // This allows user to type text that will be automatically formatted
            const newText = text.substring(0, start) + before + text.substring(start);
            onChange(newText);
            
            // Set cursor position after the opening marker
            setTimeout(() => {
              if (editorRef.current && editorRef.current.textarea) {
                const newCursorPos = start + before.length;
                editorRef.current.textarea.setSelectionRange(newCursorPos, newCursorPos);
                editorRef.current.textarea.focus();
              }
            }, 0);
          }
          // For other operations, just insert at cursor position
          else {
            const newText = text.substring(0, start) + before + after + text.substring(start);
            onChange(newText);
            
            // Set cursor position between before and after text
            setTimeout(() => {
              if (editorRef.current && editorRef.current.textarea) {
                const newCursorPos = start + before.length;
                editorRef.current.textarea.setSelectionRange(newCursorPos, newCursorPos);
                editorRef.current.textarea.focus();
              }
            }, 0);
          }
        }
      }
    } else {
      // Fallback: append to end if editor ref is not available
      const newContent = value + (value.endsWith('\n') ? '' : '\n') + before + after;
      onChange(newContent);
    }
  }, [value, onChange]);

  // Enhanced markdown insertion with better cursor handling
  const insertMarkdown = useCallback((markdownType: string) => {
    if (editorRef.current && editorRef.current.textarea) {
      const textarea = editorRef.current.textarea;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = value;
      
      let before = '';
      let after = '';
      
      switch (markdownType) {
        case 'bold':
          before = '**';
          after = '**';
          break;
        case 'italic':
          before = '*';
          after = '*';
          break;
        case 'code':
          before = '`';
          after = '`';
          break;
        case 'heading1':
          before = '# ';
          after = '';
          break;
        case 'heading2':
          before = '## ';
          after = '';
          break;
        case 'heading3':
          before = '### ';
          after = '';
          break;
        case 'heading4':
          before = '#### ';
          after = '';
          break;
        case 'heading5':
          before = '##### ';
          after = '';
          break;
        case 'heading6':
          before = '###### ';
          after = '';
          break;
        case 'bulletList':
          before = '- ';
          after = '';
          break;
        case 'numberedList':
          before = '1. ';
          after = '';
          break;
        case 'body':
          // Remove any existing heading markers
          if (editorRef.current && editorRef.current.textarea) {
            const textarea = editorRef.current.textarea;
            const start = textarea.selectionStart;
            const text = value;
            const lineStart = text.lastIndexOf('\n', start) + 1;
            const lineEnd = text.indexOf('\n', start);
            const lineEndPos = lineEnd === -1 ? text.length : lineEnd;
            const currentLineText = text.substring(lineStart, lineEndPos);
            const cleanLineText = currentLineText.replace(/^#+\s*/, '');
            const newText = text.substring(0, lineStart) + cleanLineText + text.substring(lineEndPos);
            onChange(newText);
            
            // Set cursor position at the beginning of the cleaned line
            setTimeout(() => {
              if (editorRef.current && editorRef.current.textarea) {
                const newCursorPos = lineStart;
                editorRef.current.textarea.setSelectionRange(newCursorPos, newCursorPos);
                editorRef.current.textarea.focus();
              }
            }, 0);
          }
          return;
        default:
          return;
      }
      
      insertAtCursor(before, after);
    }
  }, [value, insertAtCursor]);

  // Get current theme
  const currentTheme = mounted ? resolvedTheme || theme : "light";

  if (!mounted) {
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg border border-gray-200 dark:border-gray-700" />
    );
  }

  return (
    <div className={`markdown-editor-wrapper ${className}`}>
      {/* Custom Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        {/* Heading Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-3 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Type className="h-4 w-4 mr-1" />
              <span className="text-xs">{currentHeading}</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem onClick={() => insertMarkdown('heading1')}>
              <Heading1 className="h-4 w-4 mr-2" />
              Title
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown('heading2')}>
              <Heading2 className="h-4 w-4 mr-2" />
              Subtitle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown('heading3')}>
              <Heading2 className="h-4 w-4 mr-2" />
              Heading
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown('heading4')}>
              <Heading2 className="h-4 w-4 mr-2" />
              Subheading
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown('heading5')}>
              <Heading2 className="h-4 w-4 mr-2" />
              Section
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown('heading6')}>
              <Heading2 className="h-4 w-4 mr-2" />
              Subsection
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown('body')}>
              <Type className="h-4 w-4 mr-2" />
              Body
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* List Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-3 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <List className="h-4 w-4 mr-1" />
              <span className="text-xs">{currentListType}</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem onClick={() => insertMarkdown('bulletList')}>
              <List className="h-4 w-4 mr-2" />
              Bulleted list
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown('numberedList')}>
              <ListOrdered className="h-4 w-4 mr-2" />
              Numbered list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('bold')}
          className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('italic')}
          className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('code')}
          className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        {/* Block Elements */}
      </div>

      {/* Markdown Editor */}
      <div data-color-mode={currentTheme}>
        <MDEditor
          ref={editorRef}
          value={value}
          onChange={handleChange}
          height={height - 60} // Adjust height for toolbar
          preview="live"
          hideToolbar={true} // Hide default toolbar since we have custom one
          textareaProps={{
            placeholder,
            className: "min-h-[400px] focus:outline-none",
            onSelect: debouncedUpdateFormatting,
            onClick: debouncedUpdateFormatting,
            onKeyDown: handleKeyDown,
          }}
          className="min-h-[400px] border-0 rounded-b-lg"
        />
      </div>

      <style jsx global>{`
        .markdown-editor-wrapper {
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        
        .markdown-editor-wrapper[data-color-mode="light"] {
          background-color: white;
          color: #374151;
        }
        
        .markdown-editor-wrapper[data-color-mode="dark"] {
          background-color: #1f2937;
          color: #d1d5db;
          border-color: #374151;
        }
        
        .markdown-editor-wrapper .w-md-editor {
          border: none !important;
          border-radius: 0 0 0.75rem 0.75rem !important;
          box-shadow: none !important;
          background-color: transparent !important;
        }
        
        .markdown-editor-wrapper .w-md-editor-toolbar {
          display: none !important;
        }
        
        .markdown-editor-wrapper .w-md-editor-text {
          background-color: transparent !important;
        }
        
        .markdown-editor-wrapper .w-md-editor-text-input {
          background-color: transparent !important;
          color: inherit !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        
        .markdown-editor-wrapper .w-md-editor-text-pre {
          background-color: transparent !important;
          color: inherit !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        
        .markdown-editor-wrapper .w-md-editor-preview {
          background-color: transparent !important;
          color: inherit !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        
        .markdown-editor-wrapper .w-md-editor-preview h1,
        .markdown-editor-wrapper .w-md-editor-preview h2,
        .markdown-editor-wrapper .w-md-editor-preview h3,
        .markdown-editor-wrapper .w-md-editor-preview h4,
        .markdown-editor-wrapper .w-md-editor-preview h5,
        .markdown-editor-wrapper .w-md-editor-preview h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.25;
        }
        
        .markdown-editor-wrapper .w-md-editor-preview p {
          margin-bottom: 1em;
        }
        
        .markdown-editor-wrapper .w-md-editor-preview ul,
        .markdown-editor-wrapper .w-md-editor-preview ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        

        
        .markdown-editor-wrapper .w-md-editor-preview code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875em;
        }
        
        .markdown-editor-wrapper[data-color-mode="dark"] .w-md-editor-preview code {
          background-color: #374151;
        }
        
        .markdown-editor-wrapper .w-md-editor-preview pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .markdown-editor-wrapper[data-color-mode="dark"] .w-md-editor-preview pre {
          background-color: #374151;
        }
        
        .markdown-editor-wrapper .w-md-editor-preview pre code {
          background-color: transparent;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
