"use client";

import { useState, useEffect } from "react";
import { useGetAllBlogsQuery as useGetBlogsQuery, useUpdateBlogMutation, useDeleteBlogMutation } from "@/lib/services/blogApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Calendar,
  Tag,
  MoreHorizontal,
  Download,
  Upload,
  TrendingUp,
  Eye as EyeIcon
} from "lucide-react";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  featuredImage?: string;
}

export default function BlogsPage() {
  const { data: blogs, isLoading, error, refetch } = useGetBlogsQuery();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filteredBlogs = blogs?.filter((blog: Blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    const matchesAuthor = authorFilter === "all" || blog.author.id === authorFilter;
    
    return matchesSearch && matchesStatus && matchesAuthor;
  }) || [];

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleStatusChange = async (blogId: string, newStatus: string) => {
    try {
      await updateBlog({ id: blogId, status: newStatus }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update blog status:", error);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa blog này?")) {
      try {
        await deleteBlog(blogId).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete blog:", error);
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedBlogs.length === 0) return;
    
    try {
      if (action === "publish") {
        await Promise.all(selectedBlogs.map(id => updateBlog({ id, status: "published" })));
      } else if (action === "draft") {
        await Promise.all(selectedBlogs.map(id => updateBlog({ id, status: "draft" })));
      } else if (action === "delete") {
        if (confirm(`Bạn có chắc chắn muốn xóa ${selectedBlogs.length} blog?`)) {
          await Promise.all(selectedBlogs.map(id => deleteBlog(id)));
        }
      }
      setSelectedBlogs([]);
      refetch();
    } catch (error) {
      console.error("Bulk action failed:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="success">Đã xuất bản</Badge>;
      case "draft":
        return <Badge variant="secondary">Bản nháp</Badge>;
      case "pending":
        return <Badge variant="warning">Chờ duyệt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Bị từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-600";
      case "draft":
        return "text-gray-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Đang tải danh sách blog...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-lg text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý blog</h1>
          <p className="text-gray-600 mt-2">Quản lý nội dung blog và bài viết trong hệ thống</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo blog mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng blog</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredBlogs.length}</div>
            <p className="text-xs text-muted-foreground">Tất cả bài viết</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredBlogs.filter(b => b.status === "published").length}
            </div>
            <p className="text-xs text-muted-foreground">Bài viết công khai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredBlogs.filter(b => b.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
            <EyeIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredBlogs.reduce((sum, blog) => sum + blog.viewCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Lượt xem tổng cộng</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm blog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="pending">Chờ duyệt</option>
              <option value="rejected">Bị từ chối</option>
            </select>
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả tác giả</option>
              {/* Add author options here */}
            </select>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                Bảng
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Lưới
              </Button>
            </div>
            <Button variant="outline" className="flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedBlogs.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedBlogs.length} blog được chọn
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("publish")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Xuất bản
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("draft")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Chuyển nháp
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blogs Display */}
      {viewMode === "table" ? (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách blog</CardTitle>
            <CardDescription>
              Tổng cộng {filteredBlogs.length} blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBlogs(currentBlogs.map(b => b.id));
                          } else {
                            setSelectedBlogs([]);
                          }
                        }}
                        checked={selectedBlogs.length === currentBlogs.length && currentBlogs.length > 0}
                      />
                    </th>
                    <th className="text-left p-3 font-medium">Blog</th>
                    <th className="text-left p-3 font-medium">Tác giả</th>
                    <th className="text-left p-3 font-medium">Trạng thái</th>
                    <th className="text-left p-3 font-medium">Thống kê</th>
                    <th className="text-left p-3 font-medium">Ngày tạo</th>
                    <th className="text-left p-3 font-medium">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBlogs.map((blog) => (
                    <tr key={blog.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedBlogs.includes(blog.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBlogs([...selectedBlogs, blog.id]);
                            } else {
                              setSelectedBlogs(selectedBlogs.filter(id => id !== blog.id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                            {blog.featuredImage ? (
                              <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                            ) : (
                              <FileText className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{blog.title}</div>
                            <div className="text-sm text-gray-500 truncate">{blog.excerpt}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              {blog.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {blog.tags.length > 2 && (
                                <span className="text-xs text-gray-500">+{blog.tags.length - 2}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {blog.author.avatar ? (
                              <img src={blog.author.avatar} alt={blog.author.fullName} className="w-8 h-8 rounded-full" />
                            ) : (
                              <User className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{blog.author.fullName}</div>
                            <div className="text-xs text-gray-500">@{blog.author.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={blog.status}
                          onChange={(e) => handleStatusChange(blog.id, e.target.value)}
                          className={`border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${getStatusColor(blog.status)}`}
                        >
                          <option value="draft">Bản nháp</option>
                          <option value="pending">Chờ duyệt</option>
                          <option value="published">Xuất bản</option>
                          <option value="rejected">Từ chối</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-1">
                            <EyeIcon className="h-3 w-3 text-gray-500" />
                            <span>{blog.viewCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3 text-gray-500" />
                            <span>{blog.likeCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3 text-gray-500" />
                            <span>{blog.commentCount}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteBlog(blog.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Hiển thị {indexOfFirstBlog + 1}-{Math.min(indexOfLastBlog, filteredBlogs.length)} trong tổng số {filteredBlogs.length} blog
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBlogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {blog.featuredImage ? (
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {getStatusBadge(blog.status)}
                  <input
                    type="checkbox"
                    checked={selectedBlogs.includes(blog.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBlogs([...selectedBlogs, blog.id]);
                      } else {
                        setSelectedBlogs(selectedBlogs.filter(id => id !== blog.id));
                      }
                    }}
                  />
                </div>
                <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
                <CardDescription className="line-clamp-2">{blog.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    {blog.author.avatar ? (
                      <img src={blog.author.avatar} alt={blog.author.fullName} className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="h-3 w-3 text-gray-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{blog.author.fullName}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <EyeIcon className="h-3 w-3" />
                      {blog.viewCount}
                    </span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      {blog.likeCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{blog.tags.length - 3}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteBlog(blog.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
