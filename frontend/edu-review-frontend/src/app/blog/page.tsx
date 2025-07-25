"use client";
import { Navbar } from "@/features/landing/components/navbar/Navbar";
import { Footer } from "@/features/landing/components/footer/Footer";
import { useGetBlogsQuery } from "@/lib/services/blogApi";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Clock,
  BookOpen,
  PenSquare,
  Users,
  GraduationCap,
  MessageSquare,
  Star,
  Heart,
  Calendar,
  Eye,
  ArrowRight,
  TrendingUp,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const popularCategories = [
  {
    name: "Kinh nghiệm học tập",
    icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    count: 128,
    color: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    name: "Chọn trường đại học",
    icon: <GraduationCap className="h-5 w-5 text-purple-500" />,
    count: 95,
    color: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    name: "Tâm sự sinh viên",
    icon: <MessageSquare className="h-5 w-5 text-pink-500" />,
    count: 76,
    color: "bg-pink-50 dark:bg-pink-950/20",
  },
  {
    name: "Hướng nghiệp",
    icon: <Users className="h-5 w-5 text-green-500" />,
    count: 64,
    color: "bg-green-50 dark:bg-green-950/20",
  },
];

const recentComments = [
  {
    author: "Nguyễn Văn A",
    content: "Bài viết rất hữu ích cho các bạn đang phân vân chọn trường!",
    time: "2 giờ trước",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  {
    author: "Trần Thị B",
    content: "Mình đã áp dụng và thấy hiệu quả bất ngờ, cảm ơn tác giả!",
    time: "5 giờ trước",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
  {
    author: "Lê Văn C",
    content: "Có bài nào về kinh nghiệm xin học bổng không ạ?",
    time: "1 ngày trước",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  },
];

const popularTags = [
  { name: "Đại học", count: 45 },
  { name: "Kinh nghiệm", count: 38 },
  { name: "Học bổng", count: 24 },
  { name: "Ký túc xá", count: 19 },
  { name: "Thực tập", count: 32 },
  { name: "Hướng nghiệp", count: 28 },
  { name: "Du học", count: 15 },
  { name: "Công nghệ", count: 41 },
  { name: "Kinh tế", count: 22 },
  { name: "Y khoa", count: 18 },
];

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;
  
  const { data, isLoading, error } = useGetBlogsQuery({ 
    page: currentPage, 
    limit 
  });

  const totalPages = data?.metadata?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + "..." 
      : content;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 pt-20 md:pt-24">
        {/* Enhanced Blog Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          </div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <TrendingUp className="h-4 w-4" />
            Blog Review Đại Học
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
            Chia Sẻ & Khám Phá
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Nơi kết nối cộng đồng sinh viên, chia sẻ kinh nghiệm quý giá và 
            khám phá những câu chuyện truyền cảm hứng từ các trường đại học
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data?.metadata?.totalItems || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bài viết</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">2.4k</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lượt đọc</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">486</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bình luận</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">127</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tác giả</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Blog Posts */}
          <div className="lg:w-2/3">
            {isLoading && (
              <div className="text-center py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Đang tải bài viết...</p>
              </div>
            )}

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-red-500 rounded-full flex-shrink-0"></div>
                  <p className="font-medium">Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại sau.</p>
                </div>
              </div>
            )}

            <div className="grid gap-8 md:grid-cols-2">
              {data?.data?.map((blog, index) => (
                <article
                  key={blog.id}
                  className={`group bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/10 relative ${
                    index === 0 ? 'md:col-span-2' : ''
                  }`}
                >
                  {/* Featured Badge for first post */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      <Star className="h-3 w-3 inline mr-1" />
                      Nổi bật
                    </div>
                  )}
                  
                  <div className={`relative ${index === 0 ? 'h-80' : 'h-64'} overflow-hidden`}>
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                        <BookOpen className="h-20 w-20 text-blue-400 opacity-60" />
                      </div>
                    )}
                    {/* Enhanced overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Category tag */}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                      📚 Chia sẻ
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 gap-4">
                      <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4" />
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4" />
                        5 phút đọc
                      </span>
                      <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <Eye className="w-4 h-4" />
                        {Math.floor(Math.random() * 500) + 100}
                      </span>
                    </div>
                    
                    <h2 className={`font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 ${
                      index === 0 ? 'text-3xl' : 'text-xl'
                    }`}>
                      {blog.title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {truncateContent(blog.content)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                          👤
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">Ẩn danh</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Tác giả</div>
                        </div>
                      </div>
                      
                      <Link
                        href={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Đọc tiếp
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <Pagination className="mx-auto">
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={`rounded-xl shadow-sm border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 ${
                          currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={page === currentPage}
                          className={`rounded-xl shadow-sm border-gray-200 dark:border-gray-700 ${
                            page === currentPage
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                              : 'hover:bg-blue-50 dark:hover:bg-blue-950/20'
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={`rounded-xl shadow-sm border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 ${
                          currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Write Blog Button */}
            <Link
              href="/blog/new"
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <PenSquare className="h-5 w-5" />
              Viết bài chia sẻ
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl -z-10"></div>
            </Link>

            {/* Popular Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Chủ đề phổ biến
              </h3>
              <ul className="space-y-4">
                {popularCategories.map((category, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className={`flex items-center justify-between p-4 rounded-2xl ${category.color} hover:shadow-md transition-all duration-300 group`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                          {category.icon}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                          {category.name}
                        </span>
                      </div>
                      <span className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Comments */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-500" />
                Bình luận gần đây
              </h3>
              <ul className="space-y-4">
                {recentComments.map((comment, index) => (
                  <li key={index} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-600 shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {comment.author}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {comment.content}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {comment.time}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Hash className="h-5 w-5 text-purple-500" />
                Tags phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="group inline-flex items-center gap-1 text-sm bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md border border-gray-200 dark:border-gray-600"
                  >
                    #{tag.name}
                    <span className="ml-1 text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                      {tag.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}