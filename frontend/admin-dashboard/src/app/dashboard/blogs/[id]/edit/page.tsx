"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetBlogByIdQuery, useUpdateBlogMutation } from "@/lib/services/blogApi";
import { useGetAllTagsQuery } from "@/lib/services/tagApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { BlogCategory, BlogStatus } from "@/types/blog";
import { Tag } from "@/types/tag";
import dynamic from "next/dynamic";

// Import markdown editor dynamically to avoid SSR issues
const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md" />
});

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = Number(params.id);

  const { data: blog, isLoading: isLoadingBlog } = useGetBlogByIdQuery(blogId);
  const { data: tagsResponse, isLoading: isLoadingTags } = useGetAllTagsQuery();
  const [updateBlog] = useUpdateBlogMutation();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: BlogCategory.OTHER,
    featuredImage: "",
    tagIds: [] as number[],
  });

  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load blog data when available
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || BlogCategory.OTHER,
        featuredImage: blog.featuredImage || "",
        tagIds: blog.tags?.map(tag => tag.id) || [],
      });
      
      if (blog.featuredImageUrl) {
        setImagePreview(blog.featuredImageUrl);
      }
    }
  }, [blog]);

  // Helper function to extract tags from response
  const getTagsFromResponse = (response: any): Tag[] => {
    return response?.data?.data?.data || response?.data?.data || response?.tags || [];
  };

  const tags = getTagsFromResponse(tagsResponse);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFeaturedImageFile(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, featuredImage: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare blog data
      const blogData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        featuredImage: formData.featuredImage,
        tagIds: formData.tagIds,
      };

      // Update blog
      await updateBlog({ id: blogId, data: blogData }).unwrap();
      
      toast.success('Cập nhật blog thành công!');
      router.push(`/dashboard/blogs/${blogId}`);
    } catch (error) {
      console.error('Update blog failed:', error);
      toast.error('Cập nhật blog thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingBlog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Đang tải thông tin blog...</div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-lg text-red-600">Không tìm thấy blog</div>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="hover:bg-gray-50 hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chỉnh sửa blog</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Cập nhật thông tin bài viết</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Nhập thông tin chính của blog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề blog"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BlogCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Tóm tắt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Nhập tóm tắt ngắn gọn về blog"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>Ảnh đại diện</CardTitle>
            <CardDescription>Thêm ảnh đại diện cho blog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="featured-image"
                />
                <label htmlFor="featured-image">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Chọn ảnh
                  </Button>
                </label>
              </div>
              
              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeImage}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Xóa ảnh
                </Button>
              )}
            </div>

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Nội dung blog</CardTitle>
            <CardDescription>Sử dụng markdown để viết nội dung</CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Viết nội dung blog bằng markdown..."
            />
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Chọn tags liên quan đến blog</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTags ? (
              <div className="text-center py-4">Đang tải tags...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tagIds.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('tagIds', [...formData.tagIds, tag.id]);
                        } else {
                          handleInputChange('tagIds', formData.tagIds.filter(id => id !== tag.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="hover:bg-gray-50 hover:scale-105 transition-all duration-200"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="hover:bg-blue-700 hover:scale-105 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang cập nhật...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Cập nhật blog
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
