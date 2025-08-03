"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LogOut, Settings, User as UserIcon, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

export function AvatarDropdown({ profile, isScrolled = false }: { profile?: User | null; isScrolled?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!profile) return null;

  const avatar = profile.avatarUrl || undefined;
  const name = profile.displayName || profile.firstName || profile.lastName || "User";

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div ref={ref} className="relative z-50">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "relative h-10 px-3 rounded-full flex items-center gap-3 hover:bg-white/10 backdrop-blur-sm border transition-all duration-300 group",
              {
                "hover:bg-gray-100 dark:hover:bg-white/10 border-white bg-white/90": isScrolled,
                "hover:bg-white/10 border-white/20": !isScrolled,
              }
            )}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-8 w-8 rounded-full object-cover border-2 border-white/30 shadow-lg group-hover:border-white/50 transition-all duration-300"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 flex items-center justify-center text-white text-sm font-semibold shadow-lg group-hover:scale-110 transition-all duration-300">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className={cn(
              "hidden md:block font-medium transition-all duration-300",
              {
                "bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-orange-600": isScrolled,
                "text-white group-hover:text-blue-100": !isScrolled,
              }
            )}>
              {name}
            </span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-all duration-300",
                {
                  "bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent": isScrolled,
                  "text-white/70": !isScrolled,
                },
                open ? 'rotate-180' : ''
              )} 
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl animate-in slide-in-from-top-2 duration-200"
          align="end" 
          alignOffset={-8}
          sideOffset={8}
          forceMount
        >
          {/* User Info Header
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 flex items-center justify-center text-white font-semibold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {profile.displayName || "Student"}
                </p>
              </div>
            </div>
          </div> */}

          {/* Menu Items */}
          <div className="py-2">
            <DropdownMenuItem asChild className="px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200">
              <Link href="/profile" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">Hồ sơ cá nhân</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Quản lý thông tin cá nhân</div>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-orange-50 dark:hover:from-purple-900/20 dark:hover:to-orange-900/20 transition-all duration-200">
              <Link href="/settings" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium">Cài đặt</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Tùy chỉnh tài khoản</div>
                </div>
              </Link>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />

          {/* Logout Button */}
          <div className="px-2 py-2">
            <button
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 rounded-xl transition-all duration-200 group text-left"
              onClick={handleLogout}
            >
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors duration-200">
                <LogOut className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Đăng xuất</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Thoát khỏi tài khoản</div>
              </div>
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
