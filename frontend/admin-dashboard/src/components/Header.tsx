"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Settings, 
  LogOut, 
  Shield,
  BookOpen,
  BarChart3,
  Users,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    router.push('/dashboard/profile');
  };

  const handleSettingsClick = () => {
    router.push('/dashboard/settings');
  };

  const handleUsersClick = () => {
    router.push('/dashboard/users');
  };

  const handleBlogsClick = () => {
    router.push('/dashboard/blogs');
  };

  const handleAnalyticsClick = () => {
    router.push('/dashboard/analytics');
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.profile?.displayName) {
      return user.profile.displayName;
    }
    if (user?.username) {
      return user.username;
    }
    return user?.email || 'User';
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={user.profile?.avatarUrl} 
                      alt={getUserDisplayName()} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Thông tin cá nhân</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleUsersClick}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Quản lý người dùng</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleBlogsClick}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Quản lý bài viết</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleAnalyticsClick}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Thống kê</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
