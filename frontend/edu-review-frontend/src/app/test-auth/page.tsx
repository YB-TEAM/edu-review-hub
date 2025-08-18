"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/features/landing/components/navbar/Navbar";
import { Footer } from "@/features/landing/components/footer/Footer";
import { toast } from "sonner";

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading, error, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đã đăng xuất thành công!");
    } catch (error) {
      toast.error("Lỗi khi đăng xuất");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pt-20 md:pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Test Authentication
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Kiểm tra trạng thái đăng nhập
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>isAuthenticated:</strong> {isAuthenticated ? "✅ True" : "❌ False"}
                </div>
                <div>
                  <strong>isLoading:</strong> {isLoading ? "⏳ True" : "✅ False"}
                </div>
              </div>
              
              <div>
                <strong>localStorage accessToken:</strong> {typeof window !== 'undefined' && localStorage.getItem("accessToken") ? "✅ Có" : "❌ Không có"}
              </div>
              
              <div>
                <strong>localStorage refreshToken:</strong> {typeof window !== 'undefined' && localStorage.getItem("refreshToken") ? "✅ Có" : "❌ Không có"}
              </div>
            </CardContent>
          </Card>

          {user && (
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card>
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-red-600">{error}</div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={() => toast.success("Test toast!")}>
                  Test Toast
                </Button>
                
                {isAuthenticated && (
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
} 