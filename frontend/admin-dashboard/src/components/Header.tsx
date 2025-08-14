"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApiHelper } from "@/lib/services/apiHelper";

export function Header() {
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleLogout = () => {
    logout();
  };

  // Test toast functionality
  const testToasts = () => {
    toast.success('Đây là toast thành công!');
    setTimeout(() => toast.error('Đây là toast lỗi!'), 1000);
    setTimeout(() => toast.warning('Đây là toast cảnh báo!'), 2000);
    setTimeout(() => toast.info('Đây là toast thông tin!'), 3000);
  };

  // Test ApiHelper
  const testApiHelper = () => {
    ApiHelper.showSuccess('Test ApiHelper thành công!');
    setTimeout(() => ApiHelper.showError('Test ApiHelper lỗi!'), 1000);
    setTimeout(() => ApiHelper.showWarning('Test ApiHelper cảnh báo!'), 2000);
    setTimeout(() => ApiHelper.showInfo('Test ApiHelper thông tin!'), 3000);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Test buttons for toast functionality */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={testToasts}
            className="text-xs"
          >
            Test Toast
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={testApiHelper}
            className="text-xs"
          >
            Test ApiHelper
          </Button>
          
          <ThemeToggle />
          
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
