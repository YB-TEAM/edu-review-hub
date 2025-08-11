"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/features/landing/components/navbar/Navbar";
import { Footer } from "@/features/landing/components/footer/Footer";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCreateBlogMutation, useGetTagsQuery } from "@/lib/services/blogApi";
import { useUploadImageMutation } from "@/lib/services/uploadApi";
import { BlogCategory, Tag } from "@/types/blog";
import { ArrowLeft, Send, Save, Sparkles, Camera, Upload, X, Plus, Tag as TagIcon } from "lucide-react";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { BlogCreateGuard } from "@/components/auth/PermissionGuard";



export default function NewBlogPage() {
  return (
    <BlogCreateGuard>
      <NewBlogPageContent />
    </BlogCreateGuard>
  );
}

function NewBlogPageContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [createBlog] = useCreateBlogMutation();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: BlogCategory.GUIDE,
    featuredImage: "",
    tagIds: [] as number[],
  });

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // Use RTK Query hooks
  const { data: tagsData, isLoading: isTagsLoading } = useGetTagsQuery();
  const tags = Array.isArray(tagsData) ? tagsData : [];
  const [uploadImage] = useUploadImageMutation();

  // Check if token is valid
  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  // Tags are now fetched using RTK Query hook

  // Memoized content change handler
  const handleContentChange = useCallback((value?: string) => {
    setFormData(prev => ({ ...prev, content: value || "" }));
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ hỗ trợ file JPEG, PNG, GIF, WebP');
      return;
    }

    // Check authentication
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Vui lòng đăng nhập để upload ảnh');
      router.push('/auth/login');
      return;
    }

    // Check if token is valid
    if (!isTokenValid(accessToken)) {
      toast.error('Token đã hết hạn. Vui lòng đăng nhập lại.');
      router.push('/auth/login');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Use RTK Query upload service
      const result = await uploadImage(formData).unwrap();
      
      // Check if response has the expected structure
      if (!result.publicId || !result.secureUrl) {
        console.error('Unexpected response structure:', result);
        toast.error('Phản hồi từ server không đúng định dạng');
        return;
      }
      
      // Sử dụng publicId cho featuredImage
      setFormData(prev => ({ ...prev, featuredImage: result.publicId }));
      setUploadedImageUrl(result.secureUrl);
      
      toast.success('Upload ảnh thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể upload ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: "" }));
    setUploadedImageUrl("");
  };

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags(prev => {
      const isSelected = prev.find(t => t.id === tag.id);
      if (isSelected) {
        // Remove tag
        setFormData(prevForm => ({
          ...prevForm,
          tagIds: prevForm.tagIds.filter(id => id !== tag.id)
        }));
        return prev.filter(t => t.id !== tag.id);
      } else {
        // Add tag
        setFormData(prevForm => ({
          ...prevForm,
          tagIds: [...prevForm.tagIds, tag.id]
        }));
        return [...prev, tag];
      }
    });
  };

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
        featuredImage: formData.featuredImage,
        tagIds: formData.tagIds,
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
        featuredImage: formData.featuredImage,
        tagIds: formData.tagIds,
      }).unwrap();
      
      toast.success("Đã lưu nháp thành công!");
      router.push("/blog/my-drafts");
    } catch (error: any) {
      toast.error(error?.data?.message || "Có lỗi xảy ra khi lưu nháp");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 pt-20 md:pt-24">
        {/* Show loading or redirect if not authenticated */}
        {!isAuthenticated ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra xác thực...</p>
            </div>
          </div>
        ) : (
          <>
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

                  {/* Featured Image Upload */}
                  <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Camera className="h-5 w-5 text-blue-500" />
                        Ảnh nổi bật
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                      {!uploadedImageUrl ? (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center gap-4"
                          >
                            <Upload className="h-12 w-12 text-gray-400" />
                            <div>
                              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                {isUploading ? 'Đang upload...' : 'Click để chọn ảnh'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                JPEG, PNG, GIF, WebP (tối đa 10MB)
                              </p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={uploadedImageUrl}
                            alt="Featured"
                            className="w-full h-64 object-cover rounded-xl"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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
                      <MarkdownEditor
                        value={formData.content}
                        onChange={handleContentChange}
                        placeholder="Viết nội dung bài viết của bạn..."
                        height={500}
                        className="w-full"
                      />
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
                  {/* Category */}
                  <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-orange-500" />
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

                  {/* Tags */}
                  <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TagIcon className="h-5 w-5 text-green-500" />
                        Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Chọn tags liên quan đến bài viết
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {isTagsLoading ? (
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                              ))}
                            </div>
                          ) : tags.length > 0 ? (
                            tags.map((tag) => (
                              <Badge
                                key={tag.id}
                                variant={selectedTags.find(t => t.id === tag.id) ? "default" : "outline"}
                                className={`cursor-pointer transition-all duration-200 ${
                                  selectedTags.find(t => t.id === tag.id)
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                onClick={() => handleTagToggle(tag)}
                              >
                                {tag.name}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Không có tags nào</p>
                          )}
                        </div>
                        {selectedTags.length > 0 && (
                          <div className="pt-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Tags đã chọn:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedTags.map((tag) => (
                                <Badge
                                  key={tag.id}
                                  variant="default"
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  {tag.name}
                                  <X
                                    className="h-3 w-3 ml-1 cursor-pointer"
                                    onClick={() => handleTagToggle(tag)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 