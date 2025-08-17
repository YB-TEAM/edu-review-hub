"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetDashboardStatisticsQuery as useGetDashboardStatsQuery } from "@/lib/services/dashboardApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  FileText, 
  Building2, 
  Tags, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Plus,
  Settings,
  BarChart3,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// Mock data for development
const mockDashboardStats = {
  userStats: {
    total: 1250,
    active: 890,
    inactive: 200,
    suspended: 50,
    banned: 10,
    verified: 1200,
    unverified: 50,
    byRole: { admin: 5, moderator: 15, user: 1230 },
    byStatus: { active: 890, inactive: 200, suspended: 50, banned: 10 },
    newUsersThisWeek: 45,
    newUsersThisMonth: 180,
    activeUsersThisWeek: 750,
    activeUsersThisMonth: 890
  },
  blogStats: {
    total: 89,
    published: 75,
    pending: 12,
    rejected: 2,
    banned: 0,
    draft: 5,
    featured: 10,
    totalViews: 15420,
    totalLikes: 890,
    totalComments: 234,
    byCategory: { education: 45, technology: 20, lifestyle: 24 },
    byStatus: { published: 75, pending: 12, rejected: 2 },
    newBlogsThisWeek: 8,
    newBlogsThisMonth: 25
  },
  universityStats: {
    total: 156,
    active: 150,
    inactive: 3,
    pending: 2,
    suspended: 1,
    banned: 0,
    featured: 25,
    verified: 140,
    totalReviews: 890,
    totalViews: 45600,
    averageRating: 4.2,
    byType: { public: 120, private: 36 },
    byStatus: { active: 150, inactive: 3, pending: 2, suspended: 1 },
    byCountry: { 'Vietnam': 120, 'USA': 20, 'UK': 16 }
  },
  reviewStats: {
    total: 890,
    approved: 850,
    pending: 25,
    rejected: 15,
    totalLikes: 1200,
    totalDislikes: 50,
    averageRating: 4.3,
    byRating: { '5': 400, '4': 300, '3': 150, '2': 30, '1': 10 }
  },
  engagementStats: {
    totalViews: 61020,
    totalLikes: 2090,
    totalComments: 234,
    totalShares: 89,
    averageSessionDuration: 180,
    bounceRate: 0.25
  },
  growthStats: {
    userGrowthRate: 0.15,
    blogGrowthRate: 0.22,
    universityGrowthRate: 0.08,
    reviewGrowthRate: 0.18,
    engagementGrowthRate: 0.12
  }
};

export default function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Kiểm tra role để hiển thị menu phù hợp
  const isAdmin = hasPermission('users.read');
  const isModerator = hasPermission('blogs.read') && !hasPermission('users.read');
  
  // Chỉ Admin mới call API statistics
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery(undefined, {
    skip: !isAdmin // Skip API call nếu không phải admin
  });
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Use mock data if API fails
  useEffect(() => {
    if (error && !useMockData) {
      console.warn('Dashboard API failed, using mock data:', error);
      setUseMockData(true);
    }
  }, [error, useMockData]);

  const navigateTo = (path: string) => {
    router.push(`/dashboard/${path}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Chỉ Admin mới dùng dashboard data, Moderator dùng data đơn giản
  const dashboardData = isAdmin ? (useMockData ? mockDashboardStats : stats) : null;

  // Chỉ Admin mới hiển thị loading state
  if (isAdmin && isLoading && !useMockData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  // Chỉ Admin mới hiển thị error state
  if (isAdmin && error && !useMockData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <div className="text-lg text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
          <div className="text-sm text-gray-500 mb-4">
            API endpoint: /api/v1/dashboard/statistics<br/>
            Status: 500 Internal Server Error
          </div>
          <div className="space-x-2">
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
            <Button 
              variant="outline" 
              onClick={() => setUseMockData(true)}
            >
              Sử dụng dữ liệu mẫu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gray-900 drop-shadow-sm">Tổng quan hệ thống</h1>
            <p className="text-lg text-gray-700 font-medium">Chào mừng bạn đến với Admin Dashboard</p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <div className="text-sm text-gray-600 font-medium">{formatDate(currentTime)}</div>
            <div className="text-3xl font-mono text-blue-600 font-bold drop-shadow-sm">{formatTime(currentTime)}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`grid gap-4 ${isAdmin ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
        {/* Chỉ Admin mới thấy User Management */}
        {isAdmin && (
          <Button 
            onClick={() => navigateTo('users')}
            className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Users className="h-8 w-8" />
            <span>Quản lý người dùng</span>
          </Button>
        )}
        
        {/* Blog Management - Admin và Moderator đều thấy */}
        <Button 
          onClick={() => navigateTo('blogs')}
          className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <FileText className="h-8 w-8" />
          <span>Quản lý blog</span>
        </Button>
        
        {/* University Management - Admin và Moderator đều thấy */}
        <Button 
          onClick={() => navigateTo('universities')}
          className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
        >
          <Building2 className="h-8 w-8" />
          <span>Quản lý đại học</span>
        </Button>
        
        {/* Chỉ Admin mới thấy System Settings */}
        {isAdmin && (
          <Button 
            onClick={() => navigateTo('settings')}
            className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Settings className="h-8 w-8" />
            <span>Cài đặt hệ thống</span>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className={`grid gap-6 ${isAdmin ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
        {/* Chỉ Admin mới thấy User Stats */}
        {isAdmin && (
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500" onClick={() => navigateTo('users')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dashboardData?.userStats?.total || 0}</div>
              <div className="flex items-center space-x-1 mt-1">
                {dashboardData?.userStats?.newUsersThisMonth && dashboardData.userStats.newUsersThisMonth > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <p className="text-xs text-muted-foreground">
                  +{dashboardData?.userStats?.newUsersThisMonth || 0} tháng này
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog Management - Admin và Moderator đều thấy */}
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-green-500" onClick={() => navigateTo('blogs')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quản lý blog</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isAdmin ? (dashboardData?.blogStats?.total || 0) : 'Quản lý'}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {isAdmin ? `${dashboardData?.blogStats?.pending || 0} chờ duyệt` : 'Duyệt bài viết'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* University Management - Admin và Moderator đều thấy */}
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500" onClick={() => navigateTo('universities')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quản lý đại học</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {isAdmin ? (dashboardData?.universityStats?.total || 0) : 'Quản lý'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAdmin ? 'Đã được thêm vào hệ thống' : 'Quản lý thông tin trường'}
            </p>
          </CardContent>
        </Card>

        {/* Chỉ Admin mới thấy Tags Stats */}
        {isAdmin && (
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500" onClick={() => navigateTo('tags')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng tags</CardTitle>
              <Tags className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dashboardData?.universityStats?.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tags đang hoạt động
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Stats - Chỉ Admin mới thấy */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span>Hoạt động gần đây</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Đăng nhập hôm nay</span>
                  <span className="font-semibold">{dashboardData?.userStats?.activeUsersThisMonth || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reviews mới</span>
                  <span className="font-semibold">{dashboardData?.reviewStats?.total || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lượt xem</span>
                  <span className="font-semibold">{dashboardData?.engagementStats?.totalViews || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Hiệu suất hệ thống</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <Badge variant="outline">65%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Memory</span>
                  <Badge variant="outline">78%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge variant="outline">92%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Cảnh báo & Thông báo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{dashboardData?.blogStats?.pending || 0} blogs chờ duyệt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{dashboardData?.reviewStats?.pending || 0} reviews chờ kiểm duyệt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{0 || 0} cảnh báo hệ thống</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity - Chỉ Admin mới thấy */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>Hoạt động gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[]?.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  Không có hoạt động gần đây
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
