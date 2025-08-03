"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";
import { Bell, LayoutDashboard, Star } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const MENU = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Đánh giá",
    href: "/reviews/my",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Thông báo",
    href: "/notifications",
    icon: <Bell className="h-5 w-5" />,
  },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-950/90 border-b border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-16 justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <span className="bg-gradient-to-br from-blue-600 to-orange-500 w-8 h-8 rounded-lg flex items-center justify-center text-white">
            E
          </span>
          <span className="hidden sm:block">EduReview</span>
        </Link>
        {/* Menu */}
        <nav className="flex-1 flex items-center justify-center gap-2 sm:gap-4">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isAuthenticated && <AvatarDropdown profile={user} />}
        </div>
      </div>
    </header>
  );
}
