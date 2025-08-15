"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGetBlogByIdQuery, useLikeBlogMutation } from "@/lib/services";
import { Heart, Eye, Calendar, User, Tag, ArrowLeft, Clock, MessageSquare, Share2, BookOpen } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/ui/markdown";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md" />
});

export default function BlogDetailPage() {
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const blogId = params?.id ? Number(params.id) : null;
  
  if (!blogId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Blog ID</h1>
          <Button onClick={() => router.push("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  const { data: blog, isLoading, error } = useGetBlogByIdQuery(blogId, {
    skip: !blogId,
  });

  useEffect(() => {
    if (blog?.content) {
      const wordCount = blog.content.split(/\s+/).length;
      setReadingTime(Math.ceil(wordCount / 200));
    }
  }, [blog?.content]);

  if (!isClient || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Blog</h1>
          <Button onClick={() => router.push("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null; // Đã xử lý redirect trong useEffect
  }

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to like blogs",
        variant: "destructive"
      });
      return;
    }

    setIsLiking(true);
    try {
      // await likeBlog(blogId).unwrap();
      toast({
        title: "Success",
        description: "Blog liked successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to like blog",
        variant: "destructive"
      });
    } finally {
      setIsLiking(false);
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch blog",
      variant: "destructive"
    });
    router.push("/blog");
    return null;
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-4">The blog you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  // Check if user can view this blog
  const canView = blog.status === "approved";

  if (!canView) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">This blog is not available for public viewing.</p>
          <Button onClick={() => router.push("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Blog Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 mb-6">
            {blog.tags?.map((tag) => (
              <Link 
                key={tag.id} 
                href={`/blog?tag=${tag.name}`}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                {blog.authorName?.charAt(0) || "U"}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{blog.authorName || "Unknown Author"}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {blog.publishedAt 
                    ? new Date(blog.publishedAt).toLocaleDateString("vi-VN", { year: 'numeric', month: 'long', day: 'numeric' })
                    : new Date(blog.createdAt).toLocaleDateString("vi-VN", { year: 'numeric', month: 'long', day: 'numeric' })
                  }
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-auto">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{readingTime} phút đọc</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blog.viewsCount} lượt xem</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog?.featuredImageUrl && (
        <div className="mb-10 rounded-xl overflow-hidden shadow-xl">
          <Image
            src={blog.featuredImageUrl}
            alt={blog.title || "Blog image"}
            width={1200}
            height={630}
            className="w-full h-auto object-cover"
            priority
            onError={(e) => {
              e.currentTarget.src = '/default-blog.jpg';
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      )}

        {/* Blog Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Excerpt */}
            {blog.excerpt && (
              <div className="mb-10 p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            )}

            {/* Markdown Content */}
            <div className="prose lg:prose-xl dark:prose-invert max-w-none">
  <MarkdownRenderer content={blog.content} />
</div>


            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-8 mb-16">
              <div className="flex items-center gap-3">
                <Button
                  variant={blog.isLiked ? "default" : "outline"}
                  onClick={handleLike}
                  disabled={isLiking}
                  className="gap-2"
                >
                  <Heart className={`w-5 h-5 ${blog.isLiked ? "fill-current" : ""}`} />
                  <span>{blog.likeCount}</span>
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Bình luận</span>
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <Share2 className="w-5 h-5" />
                  <span>Chia sẻ</span>
                </Button>
              </div>

              {/* Author Actions */}
              {user && user.id === blog.authorId && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/blog/edit/${blog.id}`)}
                  >
                    Chỉnh sửa
                  </Button>
                  {blog.status === "draft" && (
                    <Button onClick={() => router.push(`/blog/publish/${blog.id}`)}>
                      Xuất bản
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Author Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {blog.authorName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{blog.authorName || "Unknown Author"}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tác giả</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Chuyên gia chia sẻ kinh nghiệm học tập và hướng nghiệp cho sinh viên.
              </p>
              <Button variant="outline" className="w-full">
                Theo dõi
              </Button>
            </div>

            {/* Table of Contents */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Mục lục
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#section1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1. Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#section2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2. Nội dung chính
                  </a>
                </li>
                <li>
                  <a href="#section3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3. Kết luận
                  </a>
                </li>
              </ul>
            </div>

            {/* Related Blogs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                Bài viết liên quan
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                        Kinh nghiệm học tập hiệu quả cho sinh viên năm nhất
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 ngày trước</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}