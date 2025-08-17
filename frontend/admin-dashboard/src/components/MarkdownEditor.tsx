"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadImageMutation } from "@/lib/services/uploadApi";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit3,
  Upload,
  X,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage] = useUploadImageMutation();

  // Convert markdown to HTML for display
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return "";

    let html = markdown
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mb-2">$1</h3>'
      )
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto my-3"><code class="text-sm font-mono">$1</code></pre>'
      )
      // Inline code
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>'
      )
      // Images
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-3" />'
      )
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      // Blockquotes
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-3 text-gray-600 dark:text-gray-400">$1</blockquote>'
      )
      // Line breaks
      .replace(/\n/g, "<br />");

    // Wrap lists
    const lines = html.split("<br />");
    let inList = false;
    let listStart = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("<li>")) {
        if (!inList) {
          inList = true;
          listStart = i;
        }
      } else if (inList && !lines[i].includes("<li>")) {
        if (listStart !== -1) {
          const listItems = lines.slice(listStart, i);
          const listHtml =
            '<ul class="list-disc list-inside space-y-1 my-3">' +
            listItems.join("") +
            "</ul>";
          lines.splice(listStart, i - listStart, listHtml);
          i = listStart;
        }
        inList = false;
        listStart = -1;
      }
    }

    if (inList && listStart !== -1) {
      const listItems = lines.slice(listStart);
      const listHtml =
        '<ul class="list-disc list-inside space-y-1 my-3">' +
        listItems.join("") +
        "</ul>";
      lines.splice(listStart);
      lines.push(listHtml);
    }

    return lines.join("<br />");
  };

  // Insert markdown at cursor position
  const insertMarkdown = (
    prefix: string,
    suffix: string = "",
    placeholder: string = ""
  ) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = "";
    if (selectedText) {
      newText =
        value.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        value.substring(end);
    } else {
      newText =
        value.substring(0, start) +
        prefix +
        placeholder +
        suffix +
        value.substring(end);
    }

    onChange(newText);

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selectedText.length
        );
      } else {
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + placeholder.length
        );
      }
    }, 0);
  };

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File ảnh không được lớn hơn 10MB");
        return;
      }

      setImageFile(file);
      setImageAlt(file.name.replace(/\.[^/.]+$/, "")); // Remove extension for default alt text
    }
  };

  // Upload image and insert markdown
  const handleImageUpload = async () => {
    if (!imageFile || !imageAlt) {
      toast.error("Vui lòng chọn ảnh và nhập alt text");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage({
        image: imageFile,
        folder: "blog-content-images",
      }).unwrap();

      // Extract image URL from response
      let imageUrl = "";
      if (result.success && result.data) {
        imageUrl = result.data.url || result.data.secureUrl;
      } else if ((result as any).url) {
        imageUrl = (result as any).url;
      } else if ((result as any).secureUrl) {
        imageUrl = (result as any).secureUrl;
      }

      if (imageUrl) {
        // Insert markdown image syntax
        const markdownImage = `![${imageAlt}](${imageUrl})`;
        insertMarkdown("", "", markdownImage);

        // Reset form
        setImageFile(null);
        setImageAlt("");
        setShowImageUpload(false);

        toast.success("Upload ảnh thành công!");
      } else {
        throw new Error("Không thể lấy URL ảnh từ response");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error(
        "Upload ảnh thất bại: " + (error as any)?.data?.message ||
          "Lỗi không xác định"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel image upload
  const cancelImageUpload = () => {
    setImageFile(null);
    setImageAlt("");
    setShowImageUpload(false);
  };

  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="border-b bg-gray-100 dark:bg-gray-800 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("**", "**", "Bold text")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("*", "*", "Italic text")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("### ", "", "Heading 3")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("## ", "", "Heading 2")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("# ", "", "Heading 1")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-400 dark:bg-gray-500 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("* ", "", "List item")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("1. ", "", "Numbered item")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("> ", "", "Blockquote")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-400 dark:bg-gray-500 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("`", "`", "code")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("[", "](url)", "Link text")}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImageUpload(true)}
          className="h-8 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-400 dark:bg-gray-500 mx-1"></div>

        <Button
          type="button"
          variant={showPreview ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="h-8 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          title="Toggle Preview"
        >
          <Eye className="h-4 w-4 mr-1" />
          {showPreview ? "Ẩn Preview" : "Xem Preview"}
        </Button>
      </div>

      {/* Image Upload Dialog */}
      {showImageUpload && (
        <div className="border-b bg-gray-50 dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Thêm ảnh vào nội dung
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={cancelImageUpload}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chọn ảnh
              </label>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alt text (mô tả ảnh)
              </label>
              <Input
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Mô tả ảnh..."
                className="text-xs"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                size="sm"
                onClick={handleImageUpload}
                disabled={!imageFile || !imageAlt || isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className="h-3 w-3 mr-2" />
                    Upload & Chèn ảnh
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={cancelImageUpload}
                disabled={isUploading}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Editor/Preview Content */}
      <div className="bg-white dark:bg-gray-900">
        {showPreview ? (
          // Preview Mode
          <div className="p-4 border-t">
            <div className="prose prose-sm max-w-none min-h-[256px] dark:prose-invert">
              {value ? (
                <div
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
                  className="markdown-content text-gray-900 dark:text-white"
                />
              ) : (
                <div className="text-gray-500 dark:text-gray-400 italic">
                  Chưa có nội dung để xem trước
                </div>
              )}
            </div>
          </div>
        ) : (
          // Edit Mode (Markdown)
          <div className="p-4">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={
                placeholder ||
                "Viết nội dung blog bằng markdown... (sử dụng các nút trên để định dạng)"
              }
              className="w-full h-64 p-3 border-0 resize-none focus:outline-none focus:ring-0 text-sm font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              style={{ minHeight: "256px" }}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Sử dụng các nút trên để định dạng văn bản. Nội dung sẽ được lưu
              dưới dạng Markdown.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
