"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { blogApi } from "@/lib/services/blogApi";
import { Blog, BlogStatus } from "@/types/blog";
import { Heart, Eye, Calendar, User, Tag, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";

// Import markdown renderer dynamically
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md" />
});

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  const blogId = Number(params.id);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const response = await blogApi.getBlogById(blogId).unwrap();
      setBlog(response);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to fetch blog",
        variant: "destructive"
      });
      router.push("/blog");
    } finally {
      setIsLoading(false);
    }
  };

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
      await blogApi.likeBlog(blogId).unwrap();
      // Refresh blog data to get updated like count
      fetchBlog();
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

  const getStatusBadge = (status: BlogStatus) => {
    const statusConfig = {
      [BlogStatus.DRAFT]: { label: "Draft", variant: "secondary" as const },
      [BlogStatus.PUBLISHED]: { label: "Published", variant: "default" as const },
      [BlogStatus.APPROVED]: { label: "Approved", variant: "default" as const },
      [BlogStatus.REJECTED]: { label: "Rejected", variant: "destructive" as const },
      [BlogStatus.BANNED]: { label: "Banned", variant: "destructive" as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
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
  const canView = blog.status === BlogStatus.APPROVED || 
                  (user && (user.id === blog.authorId || user.roles?.some(role => ['admin', 'moderator', 'super_admin'].includes(role.name))));

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Blog Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-2">
                {blog.title}
              </CardTitle>
              {getStatusBadge(blog.status)}
            </div>
          </div>

          {/* Blog Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{blog.authorName || "Unknown Author"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {blog.publishedAt 
                  ? new Date(blog.publishedAt).toLocaleDateString()
                  : new Date(blog.createdAt).toLocaleDateString()
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{blog.viewCount} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{blog.likeCount} likes</span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Tag className="w-4 h-4 text-gray-500" />
              {blog.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Featured Image */}
      {blog.featuredImage && (
        <Card className="mb-8">
          <CardContent className="p-0">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Blog Content */}
      <Card>
        <CardContent className="p-8">
          {/* Excerpt */}
          {blog.excerpt && (
            <div className="mb-8">
              <p className="text-lg text-gray-600 italic border-l-4 border-gray-300 pl-4">
                {blog.excerpt}
              </p>
            </div>
          )}

          <Separator className="mb-8" />

          {/* Markdown Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-4">
          <Button
            variant={blog.isLiked ? "default" : "outline"}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`w-4 h-4 mr-2 ${blog.isLiked ? "fill-current" : ""}`} />
            {blog.isLiked ? "Liked" : "Like"}
          </Button>
        </div>

        {/* Author Actions */}
        {user && user.id === blog.authorId && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/blog/edit/${blog.id}`)}
            >
              Edit
            </Button>
            {blog.status === BlogStatus.DRAFT && (
              <Button onClick={() => router.push(`/blog/publish/${blog.id}`)}>
                Publish
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 