"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { blogApi } from "@/lib/services/blogApi";
import { BlogCategory } from "@/types/blog";

export default function CreateBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: BlogCategory.GUIDE,
    featuredImage: "",
    tagIds: [] as number[],
    keywords: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a blog",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await blogApi.createBlog(formData).unwrap();
      toast({
        title: "Success",
        description: "Blog created successfully! It's now in draft status.",
      });
      router.push("/blog/my-drafts");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to create blog",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tạo Bài Viết Mới
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Viết bài chia sẻ của bạn. Bài viết sẽ được lưu dưới dạng nháp ban đầu.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nội Dung Bài Viết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Tóm tắt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Mô tả ngắn gọn về bài viết của bạn..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Nội dung *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Viết nội dung bài viết của bạn..."
                    className="mt-1"
                    rows={15}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Xuất Bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Danh mục</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as BlogCategory }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BlogCategory.GUIDE}>Hướng dẫn</SelectItem>
                      <SelectItem value={BlogCategory.NEWS}>Tin tức</SelectItem>
                      <SelectItem value={BlogCategory.REVIEW}>Đánh giá</SelectItem>
                      <SelectItem value={BlogCategory.INTERVIEW}>Phỏng vấn</SelectItem>
                      <SelectItem value={BlogCategory.OPINION}>Quan điểm</SelectItem>
                      <SelectItem value={BlogCategory.OTHER}>Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="featuredImage">Ảnh đại diện (URL)</Label>
                  <Input
                    id="featuredImage"
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="keywords">Từ khóa (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords.join(", ")}
                    onChange={(e) => {
                      const keywords = e.target.value.split(",").map(k => k.trim()).filter(k => k);
                      setFormData(prev => ({ ...prev, keywords }));
                    }}
                    placeholder="đại học, giáo dục, kinh nghiệm"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang tạo..." : "Tạo nháp"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
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
    </div>
  );
} 