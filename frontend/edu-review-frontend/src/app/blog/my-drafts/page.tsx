"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Blog, BlogStatus } from "@/types/blog";
import { Plus, Edit, Eye, Send } from "lucide-react";
import { AuthenticatedGuard } from "@/components/auth/PermissionGuard";
import { useGetMyDraftsQuery, usePublishBlogMutation } from "@/lib/services/blogApi";

export default function MyDraftsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use RTK Query hooks
  const { data: draftsData, isLoading, error } = useGetMyDraftsQuery(
    { page: 1, limit: 50 },
    { skip: !user }
  );
  
  const [publishBlog, { isLoading: isPublishing }] = usePublishBlogMutation();
  
  const drafts = draftsData?.data || [];

  const handlePublish = async (blogId: number) => {
    try {
      await publishBlog({ id: blogId, data: {} }).unwrap();
      
      toast({
        title: "Success",
        description: "Blog submitted for moderation!",
      });
      // RTK Query will automatically refetch the data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish blog",
        variant: "destructive"
      });
    }
  };

  // Delete function removed - blogs cannot be deleted, only banned

  const getStatusBadge = (status: BlogStatus) => {
    const statusConfig: Record<BlogStatus, { label: string; variant: "secondary" | "default" | "destructive" }> = {
      [BlogStatus.DRAFT]: { label: "Draft", variant: "secondary" },
      [BlogStatus.PUBLISHED]: { label: "Published", variant: "default" },
      [BlogStatus.PENDING]: { label: "Pending", variant: "secondary" },
      [BlogStatus.APPROVED]: { label: "Approved", variant: "default" },
      [BlogStatus.REJECTED]: { label: "Rejected", variant: "destructive" },
      [BlogStatus.BANNED]: { label: "Banned", variant: "destructive" },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in to view your drafts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Drafts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your blog drafts and published posts
          </p>
        </div>
        <Button onClick={() => router.push("/blog/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Blog
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : drafts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Edit className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No drafts yet</h3>
              <p className="text-sm">Start writing your first blog post!</p>
            </div>
            <Button onClick={() => router.push("/blog/create")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Blog
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">
                    {blog.title}
                  </CardTitle>
                  {getStatusBadge(blog.status)}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {blog.excerpt || "No excerpt available"}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags?.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/blog/edit/${blog.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/blog/${blog.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  
                  {blog.status === BlogStatus.DRAFT && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(blog.id)}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  
                  {/* Delete button removed - blogs cannot be deleted, only banned */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 