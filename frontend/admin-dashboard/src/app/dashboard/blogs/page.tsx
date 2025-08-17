"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetAllBlogsQuery, useUpdateBlogMutation, useDeleteBlogMutation, useExportBlogsMutation, useImportBlogsMutation } from "@/lib/services/blogApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
  Eye as EyeIcon,
  ChevronDown
} from "lucide-react";
import { BlogResponse } from "@/types/blog";
import { BlogStatus } from "@/types/blog";
import { BlogQueryParams } from "@/types/blog";

// Interface for actual API response structure
interface BlogApiResponse {
  data: BlogResponse[];
  metadata: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
  statistics: {
    totalBlogs: number;
    approvedBlogs: number;
    pendingBlogs: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
}

export default function BlogsPage() {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedBlogs, setSelectedBlogs] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minViews, setMinViews] = useState('');
  const [minLikes, setMinLikes] = useState('');

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Refetch when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, sortBy, sortOrder, dateFrom, dateTo, minViews, minLikes]);

  // Debug: Log current parameters
  useEffect(() => {
    console.log('🔍 Current API parameters:', {
      page: currentPage,
      limit: blogsPerPage,
      search: debouncedSearchTerm,
      status: statusFilter === "all" ? undefined : statusFilter,
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
      minViews: minViews ? parseInt(minViews) : undefined,
      minLikes: minLikes ? parseInt(minLikes) : undefined,
    });
  }, [currentPage, blogsPerPage, debouncedSearchTerm, statusFilter, sortBy, sortOrder, dateFrom, dateTo, minViews, minLikes]);

  // Prepare query parameters with useMemo to prevent infinite loops
  const queryParams = useMemo((): BlogQueryParams => ({
    page: currentPage,
    limit: blogsPerPage,
    search: debouncedSearchTerm || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as BlogStatus),
    sortBy: sortBy as any,
    sortOrder: sortOrder,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    minViews: minViews ? parseInt(minViews) : undefined,
    minLikes: minLikes ? parseInt(minLikes) : undefined,
    minComments: undefined, // Not implemented in UI yet
  }), [currentPage, blogsPerPage, debouncedSearchTerm, statusFilter, sortBy, sortOrder, dateFrom, dateTo, minViews, minLikes]);

  // Skip query if no valid parameters
  const shouldSkipQuery = !currentPage || !blogsPerPage;

  const { data: blogsResponse, isLoading, error, refetch } = useGetAllBlogsQuery(
    queryParams,
    {
      skip: shouldSkipQuery,
      // Force refetch when parameters change
      refetchOnMountOrArgChange: true,
      // Polling to ensure fresh data
      pollingInterval: 0, // Disable polling, only refetch on mount/arg change
    }
  );
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [exportBlogs] = useExportBlogsMutation();
  const [importBlogs] = useImportBlogsMutation();

  // Extract blogs array from response - handle nested data structure
  // API returns: { data: [...], metadata: {...}, statistics: {...} }
  const blogs = (blogsResponse as unknown as BlogApiResponse)?.data || [];
  const metadata = (blogsResponse as unknown as BlogApiResponse)?.metadata;
  const statistics = (blogsResponse as unknown as BlogApiResponse)?.statistics;

  // Get unique authors for filter (for display purposes only)
  const uniqueAuthors = blogs
    .map((blog: BlogResponse) => ({
      id: blog.authorId || 0,
      name: blog.authorName || 'Unknown'
    }))
    .filter((author, index, arr) => author.id && arr.findIndex(a => a.id === author.id) === index)
    .filter(Boolean);

  // Use blogs directly from API (no more local filtering/sorting needed)
  const currentBlogs = blogs;
  const totalPages = metadata?.totalPages || 1;
  const totalItems = metadata?.totalItems || 0;

  // Use statistics from API
  const totalBlogs = statistics?.totalBlogs || 0;
  const approvedBlogs = statistics?.approvedBlogs || 0;
  const pendingBlogs = statistics?.pendingBlogs || 0; // Blogs with status "published" (waiting for approval)
  const totalViews = statistics?.totalViews || 0;

  const handleStatusChange = async (blogId: number, newStatus: string) => {
    try {
      await updateBlog({ id: blogId, data: { status: newStatus as any } }).unwrap();
      toast.success('Cập nhật trạng thái thành công!');
      refetch();
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại!');
      console.error('Update status failed:', error);
    }
  };

  const handleDeleteBlog = async (blogId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa blog này?')) {
      try {
        await deleteBlog(blogId).unwrap();
        toast.success('Xóa blog thành công!');
        refetch();
      } catch (error) {
        toast.error('Xóa blog thất bại!');
        console.error('Delete blog failed:', error);
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedBlogs.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một blog');
      return;
    }

    try {
      switch (action) {
        case "approve":
          await Promise.all(selectedBlogs.map(id => updateBlog({ id, data: { status: "approved" as any } }).unwrap()));
          toast.success('Phê duyệt hàng loạt thành công!');
          break;
        case "draft":
          await Promise.all(selectedBlogs.map(id => updateBlog({ id, data: { status: "draft" as any } }).unwrap()));
          toast.success('Chuyển nháp hàng loạt thành công!');
          break;
        case "delete":
          await Promise.all(selectedBlogs.map(id => deleteBlog(id).unwrap()));
          toast.success('Xóa hàng loạt thành công!');
          break;
      }
      setSelectedBlogs([]);
      refetch();
    } catch (error) {
      toast.error('Thao tác hàng loạt thất bại!');
      console.error('Bulk action failed:', error);
    }
  };

  const handleExport = async (format: string) => {
    try {
      const result = await exportBlogs({ format: format as 'csv' | 'excel' | 'pdf' }).unwrap();
      
      // Create download link
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blogs.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Export ${format.toUpperCase()} thành công!`);
    } catch (error) {
      toast.error('Export thất bại!');
      console.error('Export failed:', error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      
    try {
      const result = await importBlogs(formData).unwrap();
      toast.success(`Import thành công: ${result.success} blog, thất bại: ${result.failed}`);
      refetch();
    } catch (error) {
      toast.error('Import thất bại!');
      console.error('Import failed:', error);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case BlogStatus.APPROVED:
        return "text-green-600";
      case BlogStatus.DRAFT:
        return "text-gray-600";
      case BlogStatus.PENDING:
        return "text-yellow-600";
      case BlogStatus.REJECTED:
        return "text-red-600";
      case BlogStatus.BANNED:
        return "text-red-800";
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý blog</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Quản lý nội dung blog và bài viết trong hệ thống</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <div className="relative">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file">
              <Button variant="outline" className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </label>
          </div>
          <div className="relative group">
            <Button variant="outline" className="flex items-center hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all duration-200 transform hover:scale-105">
              <Download className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Export Excel
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/blogs/create')}
            className="hover:bg-blue-700 hover:scale-105 transition-all duration-200 transform"
          >
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
            <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Tất cả bài viết</p>
          </CardContent>
        </Card>

                 <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Đã phê duyệt</CardTitle>
             <CheckCircle className="h-4 w-4 text-green-500" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-green-600">
              {approvedBlogs}
             </div>
             <p className="text-xs text-muted-foreground">Bài viết đã phê duyệt</p>
           </CardContent>
         </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingBlogs}
            </div>
            <p className="text-xs text-muted-foreground">Blogs đã gửi để kiểm duyệt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
            <EyeIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalViews}
            </div>
            <p className="text-xs text-muted-foreground">Lượt xem tổng cộng</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Tất cả trạng thái</option>
              <option value={BlogStatus.DRAFT} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Bản nháp</option>
              <option value={BlogStatus.PENDING} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Chờ duyệt</option>
              <option value={BlogStatus.APPROVED} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Đã phê duyệt</option>
              <option value={BlogStatus.REJECTED} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Bị từ chối</option>
              <option value={BlogStatus.BANNED} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Bị cấm</option>
             </select>
                         <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="createdAt" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Ngày tạo (mới nhất)</option>
              <option value="viewCount" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Lượt xem</option>
              <option value="likeCount" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Lượt like</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="DESC" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Giảm dần</option>
              <option value="ASC" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Tăng dần</option>
             </select>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="hover:scale-105 transition-transform duration-200"
              >
                Bảng
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="hover:scale-105 transition-transform duration-200"
              >
                Lưới
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? 'Ẩn' : 'Hiện'} lọc nâng cao
            </Button>
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSortBy('createdAt');
                setSortOrder('DESC');
                setDateFrom('');
                setDateTo('');
                setMinViews('');
                setMinLikes('');
                setCurrentPage(1); // Reset to first page
              }}
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 transform hover:scale-105"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                <Input
                  type="date"
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                <Input
                  type="date"
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lượt xem tối thiểu</label>
                <Input
                  type="number"
                  placeholder="0"
                  onChange={(e) => setMinViews(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lượt like tối thiểu</label>
                <Input
                  type="number"
                  placeholder="0"
                  onChange={(e) => setMinLikes(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                   onClick={() => handleBulkAction("approve")}
                   className="hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all duration-200 transform hover:scale-105"
                 >
                   <CheckCircle className="h-4 w-4 mr-2" />
                   Phê duyệt
                 </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("draft")}
                   className="hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-600 transition-all duration-200 transform hover:scale-105"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Chuyển nháp
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                   className="hover:bg-red-600 hover:scale-105 transition-all duration-200 transform"
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
              Tổng cộng {totalItems} blog
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
                    <tr key={blog.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out group">
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
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200">
                            {blog.featuredImageUrl ? (
                              <img src={blog.featuredImageUrl} alt={blog.title} className="w-full h-full object-cover" />
                            ) : (
                              <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors duration-200">{blog.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{blog.excerpt}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              {blog.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200">
                                  {tag.name}
                                </Badge>
                              ))}
                              {blog.tags.length > 2 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">+{blog.tags.length - 2}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors duration-200">
                            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">{blog.authorName || 'Unknown'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">@{blog.authorName || 'Unknown'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                                                 <select
                           value={blog.status}
                           onChange={(e) => handleStatusChange(blog.id, e.target.value)}
                          className={`border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-400 bg-white ${getStatusColor(blog.status)}`}
                        >
                          <option value="draft" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Bản nháp</option>
                          <option value="published" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Chờ duyệt</option>
                          <option value="approved" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Đã phê duyệt</option>
                          <option value="rejected" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Từ chối</option>
                          <option value="banned" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Bị cấm</option>
                         </select>
                      </td>
                      <td className="p-3">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-1 group-hover:text-blue-600 transition-colors duration-200">
                            <EyeIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                            <span>{blog.viewCount}</span>
                          </div>
                          <div className="flex items-center space-x-1 group-hover:text-blue-600 transition-colors duration-200">
                            <TrendingUp className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                            <span>{blog.likeCount}</span>
                          </div>
                          <div className="flex items-center space-x-1 group-hover:text-blue-600 transition-colors duration-200">
                            <Tag className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                            <span>{blog.commentCount}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/blogs/${blog.id}`)}
                            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/blogs/${blog.id}/edit`)}
                            className="hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all duration-200 transform hover:scale-105"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="hover:bg-red-600 hover:scale-105 transition-all duration-200"
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
                  Hiển thị {((currentPage - 1) * blogsPerPage) + 1}-{Math.min(currentPage * blogsPerPage, totalItems)} trong tổng số {totalItems} blog
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
            <Card key={blog.id} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out group border-0 shadow-md hover:border-blue-200 dark:hover:border-blue-700">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                {blog.featuredImageUrl ? (
                  <img src={blog.featuredImageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors duration-300">
                    <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200 hover:scale-110"
                  />
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">{blog.title}</CardTitle>
                <CardDescription className="line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{blog.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors duration-300">
                    <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors duration-300">{blog.authorName || 'Unknown'}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1 group-hover:text-blue-600 transition-colors duration-300">
                      <EyeIcon className="h-3 w-3" />
                      {blog.viewCount}
                    </span>
                    <span className="flex items-center space-x-1 group-hover:text-blue-600 transition-colors duration-300">
                      <TrendingUp className="h-3 w-3" />
                      {blog.likeCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                      {tag.name}
                    </Badge>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">+{blog.tags.length - 3}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push(`/dashboard/blogs/${blog.id}`)}
                    className="flex-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push(`/dashboard/blogs/${blog.id}/edit`)}
                    className="flex-1 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="hover:bg-red-600 hover:scale-105 transition-all duration-300"
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
