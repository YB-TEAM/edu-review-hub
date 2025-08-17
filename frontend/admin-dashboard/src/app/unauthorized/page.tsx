"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Home, LogOut } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              Truy cập bị từ chối
            </CardTitle>
            <CardDescription className="text-red-600">
              Bạn không có quyền truy cập trang này
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span>Trang Admin Dashboard chỉ dành cho Admin và Moderator</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  Tài khoản của bạn có role <strong>Student</strong> và chỉ có thể:
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Xem blogs và reviews</li>
                  <li>• Xem thông tin trường đại học</li>
                  <li>• Không thể quản lý hệ thống</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
              
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
