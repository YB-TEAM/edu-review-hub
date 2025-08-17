"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetBlogByIdQuery } from "@/lib/services/blogApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Globe,
  Settings
} from "lucide-react";
import { BlogStatus } from "@/types/blog";

export default function ViewBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = Number(params.id);
  const [viewMode, setViewMode] = useState<'admin' | 'public'>('admin');

  const { data: blog, isLoading, error } = useGetBlogByIdQuery(blogId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case BlogStatus.APPROVED:
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã phê duyệt</Badge>;
      case BlogStatus.DRAFT:
        return <Badge variant="secondary">Bản nháp</Badge>;
      case BlogStatus.PENDING:
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      case BlogStatus.REJECTED:
        return <Badge variant="destructive">Bị từ chối</Badge>;
      case BlogStatus.BANNED:
        return <Badge variant="destructive">Bị cấm</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case BlogStatus.APPROVED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case BlogStatus.DRAFT:
        return <FileText className="h-4 w-4 text-gray-600" />;
      case BlogStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case BlogStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      case BlogStatus.BANNED:
        return <Ban className="h-4 w-4 text-red-800" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Đang tải thông tin blog...</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-lg text-red-600">Không thể tải thông tin blog</div>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  // Public View Layout (what end users see)
  const PublicView = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog</h1>
                <p className="text-gray-600 dark:text-gray-300">Xem bài viết</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Globe className="h-4 w-4 mr-1" />
                Public View
              </Badge>
              <Button
                variant="outline"
                onClick={() => setViewMode('admin')}
                className="hover:bg-gray-50 hover:scale-105 transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin View
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Featured Image */}
        {blog.featuredImageUrl && (
          <div className="mb-8">
            <img 
              src={blog.featuredImageUrl} 
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Blog Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {blog.category}
            </Badge>
            {blog.status === BlogStatus.APPROVED && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Đã xuất bản
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {blog.title}
          </h1>
          
          {blog.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{blog.authorName || 'Unknown'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{blog.viewCount} lượt xem</span>
            </div>

            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{blog.likeCount} lượt thích</span>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div 
            dangerouslySetInnerHTML={{ __html: blog.content }} 
            className="markdown-content text-gray-900 dark:text-white leading-relaxed"
          />
        </article>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          <p>© 2024 Edu Review Hub. Tất cả quyền được bảo lưu.</p>
        </footer>
      </main>
    </div>
  );

  // Admin View Layout (original layout)
  const AdminView = () => (
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Xem blog</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Chi tiết bài viết</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setViewMode('public')}
            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            <Globe className="h-4 w-4 mr-2" />
            Public View
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push(`/dashboard/blogs/${blog.id}/edit`)}
            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Blog Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {blog.featuredImageUrl && (
            <Card>
              <CardContent className="p-0">
                <img 
                  src={blog.featuredImageUrl} 
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Blog Title & Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(blog.status)}
                  {getStatusBadge(blog.status)}
                </div>
                <div className="text-sm text-gray-500">
                  ID: #{blog.id}
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">{blog.title}</CardTitle>
              {blog.excerpt && (
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                  {blog.excerpt}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Blog Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin blog</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">{blog.authorName || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">Tác giả</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-sm text-gray-500">Ngày tạo</div>
                </div>
              </div>

              {blog.publishedAt && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {new Date(blog.publishedAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-sm text-gray-500">Ngày xuất bản</div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">{blog.category}</div>
                  <div className="text-sm text-gray-500">Danh mục</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <span>Lượt xem</span>
                </div>
                <span className="font-bold text-blue-600">{blog.viewCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Lượt like</span>
                </div>
                <span className="font-bold text-green-600">{blog.likeCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-purple-500" />
                  <span>Bình luận</span>
                </div>
                <span className="font-bold text-purple-600">{blog.commentCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  // Render based on view mode
  return viewMode === 'public' ? <PublicView /> : <AdminView />;
}
