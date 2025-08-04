"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { blogApi } from "@/lib/services/blogApi";
import { Blog, BlogStatus } from "@/types/blog";
import { Eye, Check, X, Ban, Clock, User, Calendar } from "lucide-react";

export default function BlogModerationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [moderationReason, setModerationReason] = useState("");
  const [isModerating, setIsModerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchModerationBlogs();
    }
  }, [user]);

  const fetchModerationBlogs = async () => {
    try {
      const response = await blogApi.getModerationBlogs({ page: 1, limit: 50 }).unwrap();
      setBlogs(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to fetch blogs for moderation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerate = async (action: 'approve' | 'reject' | 'ban') => {
    if (!selectedBlog) return;

    if (action === 'reject' && !moderationReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }

    setIsModerating(true);
    try {
      switch (action) {
        case 'approve':
          await blogApi.approveBlog({ id: selectedBlog.id, data: { moderationReason } }).unwrap();
          break;
        case 'reject':
          await blogApi.rejectBlog({ id: selectedBlog.id, data: { moderationReason } }).unwrap();
          break;
        case 'ban':
          await blogApi.banBlog({ id: selectedBlog.id, data: { moderationReason } }).unwrap();
          break;
      }

      toast({
        title: "Success",
        description: `Blog ${action}d successfully!`,
      });
      
      setSelectedBlog(null);
      setModerationReason("");
      fetchModerationBlogs(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || `Failed to ${action} blog`,
        variant: "destructive"
      });
    } finally {
      setIsModerating(false);
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

  // Check if user has admin/moderator permissions
  const hasModerationPermission = user?.roles?.some(role => 
    ['admin', 'moderator', 'super_admin'].includes(role.name)
  );

  if (!user || !hasModerationPermission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Blog Moderation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and moderate published blogs
        </p>
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
      ) : blogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No blogs to moderate</h3>
              <p className="text-sm">All published blogs have been reviewed.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">
                    {blog.title}
                  </CardTitle>
                  {getStatusBadge(blog.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>{blog.authorName || "Unknown Author"}</span>
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
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
                    onClick={() => router.push(`/blog/${blog.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedBlog(blog)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Blog</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Are you sure you want to approve "{blog.title}"?</p>
                        <div>
                          <Label htmlFor="reason">Optional Reason</Label>
                          <Textarea
                            id="reason"
                            value={moderationReason}
                            onChange={(e) => setModerationReason(e.target.value)}
                            placeholder="Optional reason for approval..."
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleModerate('approve')}
                            disabled={isModerating}
                          >
                            {isModerating ? "Approving..." : "Approve"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedBlog(null);
                              setModerationReason("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setSelectedBlog(blog)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Blog</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Are you sure you want to reject "{blog.title}"?</p>
                        <div>
                          <Label htmlFor="reason">Reason *</Label>
                          <Textarea
                            id="reason"
                            value={moderationReason}
                            onChange={(e) => setModerationReason(e.target.value)}
                            placeholder="Please provide a reason for rejection..."
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            onClick={() => handleModerate('reject')}
                            disabled={isModerating || !moderationReason.trim()}
                          >
                            {isModerating ? "Rejecting..." : "Reject"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedBlog(null);
                              setModerationReason("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setSelectedBlog(blog)}
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        Ban
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ban Blog</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Are you sure you want to ban "{blog.title}"?</p>
                        <div>
                          <Label htmlFor="reason">Reason *</Label>
                          <Textarea
                            id="reason"
                            value={moderationReason}
                            onChange={(e) => setModerationReason(e.target.value)}
                            placeholder="Please provide a reason for banning..."
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            onClick={() => handleModerate('ban')}
                            disabled={isModerating || !moderationReason.trim()}
                          >
                            {isModerating ? "Banning..." : "Ban"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedBlog(null);
                              setModerationReason("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 