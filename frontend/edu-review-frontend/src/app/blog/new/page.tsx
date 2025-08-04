"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/features/landing/components/navbar/Navbar";
import { Footer } from "@/features/landing/components/footer/Footer";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { blogApi, useCreateBlogMutation } from "@/lib/services/blogApi";
import { BlogCategory } from "@/types/blog";
import { ArrowLeft, Send, Save, Plus, Tag, Image as ImageIcon, X, Sparkles, Camera } from "lucide-react";
import dynamic from "next/dynamic";
import { ImageUpload } from "@/components/ui/image-upload";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

export default function NewBlogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");

  const [createBlog] = useCreateBlogMutation();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: BlogCategory.GUIDE,
    featuredImage: "",
    tagIds: [] as number[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết");
      return;
    }

    setIsLoading(true);
    try {
      await createBlog({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        featuredImage: uploadedImage || formData.featuredImage,
        keywords: keywords,
      }).unwrap();
      
      toast.success("Tạo bài viết thành công!");
      router.push("/blog");
    } catch (error: any) {
      toast.error(error?.data?.message || "Có lỗi xảy ra khi tạo bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await createBlog({
        title: formData.title || "Bài viết nháp",
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        featuredImage: uploadedImage || formData.featuredImage,
        keywords: keywords,
      }).unwrap();
      
      toast.success("Đã lưu nháp thành công!");
      router.push("/blog/my-drafts");
    } catch (error: any) {
      toast.error(error?.data?.message || "Có lỗi xảy ra khi lưu nháp");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (value?: string) => {
    setFormData(prev => ({ ...prev, content: value || "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload - in real app, upload to cloudinary
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast.success("Tải ảnh thành công!");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage("");
    setFormData(prev => ({ ...prev, featuredImage: "" }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Tạo Bài Viết Mới
              </h1>
              <Sparkles className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Chia sẻ kinh nghiệm và kiến thức của bạn với cộng đồng
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-4">
              {/* Title */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <Label htmlFor="title" className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 block">
                    Tiêu đề bài viết
                  </Label>
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề bài viết..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-semibold border-0 bg-transparent focus:ring-0 focus:border-0 p-0 placeholder:text-gray-400 dark:placeholder:text-gray-500 mt-2"
                  />
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-500" />
                    Nội dung bài viết
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div data-color-mode="dark">
                    <MDEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      height={600}
                      preview="edit"
                      textareaProps={{ placeholder: "Viết nội dung bài viết của bạn..." }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-1">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Tóm tắt bài viết
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-1">
                  <textarea
                    placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full h-32 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-4">
              {/* Featured Image Upload */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-green-500" />
                    Ảnh đại diện
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <ImageUpload
                    onImageUpload={setUploadedImage}
                    onImageRemove={removeImage}
                    currentImage={uploadedImage}
                  />
                </CardContent>
              </Card>

              {/* Category */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-orange-500" />
                    Danh mục
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as BlogCategory }))}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BlogCategory.GUIDE}>Hướng dẫn</SelectItem>
                      <SelectItem value={BlogCategory.REVIEW}>Đánh giá</SelectItem>
                      <SelectItem value={BlogCategory.NEWS}>Tin tức</SelectItem>
                      <SelectItem value={BlogCategory.TUTORIAL}>Tutorial</SelectItem>
                      <SelectItem value={BlogCategory.INTERVIEW}>Phỏng vấn</SelectItem>
                      <SelectItem value={BlogCategory.CASE_STUDY}>Case study</SelectItem>
                      <SelectItem value={BlogCategory.OTHER}>Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Keywords */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-500" />
                    Từ khóa
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Thêm từ khóa..."
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      className="h-12 text-base"
                    />
                    <Button type="button" onClick={addKeyword} size="sm" className="h-12 px-4">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-full text-sm font-medium shadow-sm"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                      disabled={isLoading}
                    >
                      <Send className="h-5 w-5 mr-2" />
                      {isLoading ? "Đang tạo..." : "Tạo bài viết"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200" 
                      onClick={handleSaveDraft} 
                      disabled={isSaving}
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {isSaving ? "Đang lưu..." : "Lưu nháp"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full h-12 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200" 
                      onClick={() => router.back()}
                    >
                      Hủy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
} 