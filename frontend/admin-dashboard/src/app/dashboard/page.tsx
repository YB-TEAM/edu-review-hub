"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetDashboardStatisticsQuery as useGetDashboardStatsQuery } from "@/lib/services/dashboardApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <div className="text-lg text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tổng quan hệ thống</h1>
            <p className="text-gray-600 mt-2">Chào mừng bạn đến với Admin Dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-sm text-gray-500">{formatDate(currentTime)}</div>
            <div className="text-2xl font-mono text-blue-600">{formatTime(currentTime)}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          onClick={() => navigateTo('users')}
          className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Users className="h-8 w-8" />
          <span>Quản lý người dùng</span>
        </Button>
        <Button 
          onClick={() => navigateTo('blogs')}
          className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <FileText className="h-8 w-8" />
          <span>Quản lý blog</span>
        </Button>
        <Button 
          onClick={() => navigateTo('universities')}
          className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
        >
          <Building2 className="h-8 w-8" />
          <span>Quản lý đại học</span>
        </Button>
        <Button 
          onClick={() => navigateTo('settings')}
          className="h-auto p-4 flex flex-col items-center space-y-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Settings className="h-8 w-8" />
          <span>Cài đặt hệ thống</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500" onClick={() => navigateTo('users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
            <div className="flex items-center space-x-1 mt-1">
              {stats?.newUsersThisMonth && stats.newUsersThisMonth > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <p className="text-xs text-muted-foreground">
                +{stats?.newUsersThisMonth || 0} tháng này
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-green-500" onClick={() => navigateTo('blogs')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng blog</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.totalBlogs || 0}</div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {stats?.pendingBlogs || 0} chờ duyệt
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500" onClick={() => navigateTo('universities')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đại học</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.totalUniversities || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đã được thêm vào hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500" onClick={() => navigateTo('tags')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tags</CardTitle>
            <Tags className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.totalTags || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tags đang hoạt động
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
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
                <span className="font-semibold">{stats?.todayLogins || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reviews mới</span>
                <span className="font-semibold">{stats?.newReviews || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lượt xem</span>
                <span className="font-semibold">{stats?.totalViews || 0}</span>
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
                <span className="text-sm text-gray-600">{stats?.pendingBlogs || 0} blogs chờ duyệt</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{stats?.pendingReviews || 0} reviews chờ kiểm duyệt</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{stats?.systemAlerts || 0} cảnh báo hệ thống</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span>Hoạt động gần đây</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentActivities?.slice(0, 5).map((activity: any, index: number) => (
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
    </div>
  );
}
