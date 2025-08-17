"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getMenuItemsForRole } from "@/types/permissions";
import { 
  Users, 
  FileText, 
  Building2, 
  Tags, 
  Activity,
  TrendingUp,
  Settings,
  Shield,
  Menu,
  X,
  Home,
  BarChart3,
  LogOut,
  User,
  Bell,
  ChevronDown
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  Home,
  Users,
  FileText,
  Building2,
  Tags,
  BarChart3,
  Settings,
  Shield,
  Activity,
  TrendingUp
};

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Tránh hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lấy menu items dựa trên role của user
  const menuItems = user && mounted ? getMenuItemsForRole(user.accountType as any) : [];

  const handleNavigation = (path: string) => {
    router.push(path);
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'moderator':
        return 'Moderator';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'moderator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Loading state */}
        {!mounted && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Content when mounted */}
        {mounted && (
          <>
            {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ER</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Admin Hub</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

            {/* User Info */}
            {user && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getRoleColor(user.accountType)}`}>
                  {getRoleDisplayName(user.accountType)}
                </span>
              </div>
            </div>
          </div>
        )}

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Quản lý chính
            </h3>
            {menuItems.map((item) => {
              const IconComponent = iconMap[item.icon] || Home;
              const isActive = pathname === item.path;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <IconComponent className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Đăng xuất
          </Button>
        </div>
          </>
        )}
      </div>
    </>
  );
}
