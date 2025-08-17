"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateBlogMutation } from "@/lib/services/blogApi";
import { useGetAllTagsQuery } from "@/lib/services/tagApi";
import { useUploadImageMutation } from "@/lib/services/uploadApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { BlogCategory } from "@/types/blog";
import { Tag } from "@/types/tag";
import dynamic from "next/dynamic";

// Import markdown editor dynamically to avoid SSR issues
const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md" />
});

export default function CreateBlogPage() {
  const router = useRouter();
  const [createBlog] = useCreateBlogMutation();
  const { data: tagsResponse, isLoading: tagsLoading } = useGetAllTagsQuery({});
  const [uploadImage] = useUploadImageMutation();
  
  // Interface để handle cả 2 cấu trúc response từ upload API
  interface ImageUploadResult {
    publicId: string;
    url: string;
    secureUrl: string;
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    resourceType?: string;
    createdAt?: Date;
  }
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: BlogCategory.NEWS,
    featuredImage: '',
    featuredImageFile: null as File | null,
    tagIds: [] as number[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // State để lưu kết quả upload ảnh đã thành công
  const [uploadedImageResult, setUploadedImageResult] = useState<ImageUploadResult | null>(null);
  
  // State để track xem ảnh đã được upload chưa
  const [imageUploaded, setImageUploaded] = useState(false);
  
  // Extract tags from API response - handle different response structures
  const getTagsFromResponse = (response: any): Tag[] => {
    if (!response) return [];
    
    // Try different possible structures
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.tags)) return response.tags;
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data)) return response.data.data;
    if (response.data && response.data.data && Array.isArray(response.data.data.data)) return response.data.data.data;
    
    return [];
  };

  const tags: Tag[] = getTagsFromResponse(tagsResponse);

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File ảnh không được lớn hơn 10MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        featuredImageFile: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeSelectedImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImageFile: null
    }));
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);

    try {
      let featuredImagePublicId = formData.featuredImage;

      // Upload image first if there's a file selected
      if (formData.featuredImageFile) {
        console.log('🔍 Starting image upload...', {
          file: formData.featuredImageFile,
          fileName: formData.featuredImageFile.name,
          fileSize: formData.featuredImageFile.size,
          fileType: formData.featuredImageFile.type
        });
        
        toast.info('Đang upload ảnh...');
        
        try {
          const uploadResult = await uploadImage({
            image: formData.featuredImageFile,
            folder: 'blog-featured-images'
          }).unwrap();

          console.log('🔍 Upload result:', uploadResult);

          // Check if upload was successful - handle both possible response structures
          let imageData: ImageUploadResult | null = null;
          if (uploadResult.success && uploadResult.data) {
            // Standard response structure: { success: true, data: { publicId, ... } }
            imageData = uploadResult.data as ImageUploadResult;
          } else if ((uploadResult as any).publicId) {
            // Direct response structure: { publicId, url, secureUrl, ... }
            imageData = uploadResult as any as ImageUploadResult;
          }

          if (imageData && imageData.publicId) {
            featuredImagePublicId = imageData.publicId;
            toast.success('Upload ảnh thành công!');
            setUploadedImageResult(imageData);
            setImageUploaded(true);
            console.log('✅ Image uploaded successfully, publicId:', featuredImagePublicId);
          } else {
            throw new Error('Upload ảnh thất bại: ' + ((uploadResult as any).error || 'Lỗi không xác định'));
          }
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
          throw new Error('Upload ảnh thất bại: ' + (uploadError as any)?.data?.message || 'Lỗi không xác định');
        }
      }

      console.log('🔍 Preparing blog data:', {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        featuredImage: featuredImagePublicId,
        tagIds: formData.tagIds
      });

      // Prepare data for API - only send fields that backend expects
      const blogData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || '',
        category: formData.category,
        featuredImage: featuredImagePublicId || undefined,
        tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined
      };

      toast.info('Đang tạo blog...');
      
      const result = await createBlog(blogData).unwrap();
      console.log('✅ Blog created successfully:', result);
      toast.success('Tạo blog thành công!');
      
      router.push('/dashboard/blogs');
    } catch (error) {
      console.error("❌ Create blog failed:", error);
      toast.error('Tạo blog thất bại: ' + (error as any)?.data?.message || 'Lỗi không xác định');
      
      // Nếu tạo blog thất bại, sử dụng ảnh đã upload nếu có
      if (imageUploaded && uploadedImageResult) {
        toast.info('Sử dụng ảnh đã upload để tạo blog lại...');
        try {
          const blogData = {
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt || '',
            category: formData.category,
            featuredImage: uploadedImageResult.publicId,
            tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined
          };
          const retryResult = await createBlog(blogData).unwrap();
          console.log('✅ Blog created successfully on retry:', retryResult);
          toast.success('Tạo blog thành công sau khi sử dụng ảnh đã upload!');
          router.push('/dashboard/blogs');
        } catch (retryError) {
          console.error('❌ Retry create blog failed:', retryError);
          toast.error('Tạo blog thất bại sau khi sử dụng ảnh đã upload: ' + (retryError as any)?.data?.message || 'Lỗi không xác định');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeTag = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(id => id !== tagId)
    }));
  };

  const toggleTag = (tagId: number) => {
    if (formData.tagIds.includes(tagId)) {
      removeTag(tagId);
    } else {
      setFormData(prev => ({
        ...prev,
        tagIds: [...prev.tagIds, tagId]
      }));
    }
  };

  const getSelectedTagNames = () => {
    return formData.tagIds.map(tagId => {
      const tag = tags.find((t: Tag) => t.id === tagId);
      return tag ? tag.name : '';
    }).filter(name => name).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tạo blog mới</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Tạo bài viết blog mới cho hệ thống</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Nội dung chính</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Thông tin cơ bản của blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Tiêu đề *
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề blog..."
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Tóm tắt
                  </label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Tóm tắt ngắn gọn nội dung blog..."
                    rows={3}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Nội dung *
                  </label>
                  <MarkdownEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                    placeholder="Nội dung chi tiết của blog..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Ảnh đại diện
                  </label>
                  
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    {/* File Input */}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <div className="relative w-full max-w-md">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <Button
                            type="button"
                            onClick={removeSelectedImage}
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Ảnh đã chọn, sẽ được upload khi tạo blog
                        </p>
                      </div>
                    )}

                    {/* Upload Instructions */}
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                      <p className="font-medium mb-1">📸 Hướng dẫn upload ảnh:</p>
                      <p>• Chọn file ảnh từ máy tính (JPEG, PNG, GIF, WebP)</p>
                      <p>• Kích thước tối đa: 10MB</p>
                      <p>• Ảnh sẽ được lưu trữ an toàn trên Cloudinary</p>
                      <p>• Ảnh sẽ được upload tự động khi bạn nhấn "Tạo blog"</p>
                      <p>• Hệ thống sẽ sử dụng Cloudinary Public ID để lưu trữ</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Cài đặt</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Cấu hình blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as BlogCategory }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  >
                    <option value={BlogCategory.NEWS}>Tin tức</option>
                    <option value={BlogCategory.GUIDE}>Hướng dẫn</option>
                    <option value={BlogCategory.REVIEW}>Đánh giá</option>
                    <option value={BlogCategory.INTERVIEW}>Phỏng vấn</option>
                    <option value={BlogCategory.OPINION}>Ý kiến</option>
                    <option value={BlogCategory.OTHER}>Khác</option>
                  </select>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  <p className="font-medium mb-2">Lưu ý:</p>
                  <ul className="space-y-1">
                    <li>• Blog sẽ được tạo với trạng thái "Bản nháp" mặc định</li>
                    <li>• Bạn có thể gửi để kiểm duyệt sau khi tạo</li>
                    <li>• Hệ thống sẽ tự động xử lý quyền hiển thị</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Tags</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Chọn tags cho blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tag Selection Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Chọn tags
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.tagIds.length} tags được chọn
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-sm">Chọn tags</span>
                      <svg className={`h-4 w-4 text-gray-400 transition-transform ${showTagDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Dropdown Menu */}
                  {showTagDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {tagsLoading ? (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            <span>Đang tải tags...</span>
                          </div>
                        </div>
                      ) : !tagsResponse ? (
                        <div className="px-3 py-2 text-sm text-red-500 dark:text-red-400">
                          Lỗi khi tải tags
                        </div>
                      ) : tags.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                          Không có tags nào được tìm thấy
                        </div>
                      ) : (
                        <div className="py-1">
                          {tags.map((tag: Tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                formData.tagIds.includes(tag.id)
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{tag.name}</span>
                                {formData.tagIds.includes(tag.id) && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Tags Display */}
                {formData.tagIds.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tags đã chọn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.tagIds.map((tagId) => {
                        const tag = tags.find((t: Tag) => t.id === tagId);
                        return tag ? (
                          <span key={tagId} className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white rounded-full px-2 py-1 text-xs font-medium">
                            <span>{tag.name}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tagId)}
                              className="ml-1 hover:text-green-200 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading || tagsLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {formData.featuredImageFile ? 'Đang upload ảnh và tạo blog...' : 'Đang tạo blog...'}
              </>
            ) : (
              'Tạo blog'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}