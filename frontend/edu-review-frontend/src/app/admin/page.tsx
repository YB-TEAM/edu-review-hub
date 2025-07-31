"use client";
import { AppHeader } from "@/components/app/AppHeader";
import { AppFooter } from "@/components/app/AppFooter";
import { useUserProfile } from "@/hooks/useUserProfile";
import Link from "next/link";
import {
  Users,
  School,
  FileText,
  Shield,
  BarChart,
  AlertTriangle,
  UserCog,
} from "lucide-react";

const dashboardActions = [
  {
    title: "Quản lý người dùng",
    description: "Xem, chỉnh sửa, khóa hoặc phân quyền người dùng hệ thống.",
    icon: <Users className="h-8 w-8 text-blue-500 transition-transform group-hover:scale-110" />,
    href: "/admin/users",
    color: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/40 dark:to-gray-900 border border-blue-100 dark:border-blue-700",
  },
  {
    title: "Quản lý nội dung",
    description: "Duyệt, chỉnh sửa hoặc xóa các bài viết, đánh giá, bình luận.",
    icon: <FileText className="h-8 w-8 text-purple-500 transition-transform group-hover:scale-110" />,
    href: "/admin/content",
    color: "bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/40 dark:to-gray-900 border border-purple-100 dark:border-purple-700",
  },
  {
    title: "Quản lý trường đại học",
    description: "Thêm, sửa, xóa thông tin các trường đại học.",
    icon: <School className="h-8 w-8 text-green-500 transition-transform group-hover:scale-110" />,
    href: "/admin/universities",
    color: "bg-gradient-to-br from-green-50 to-white dark:from-green-900/40 dark:to-gray-900 border border-green-100 dark:border-green-700",
  },
  {
    title: "Báo cáo thống kê",
    description: "Xem biểu đồ, số liệu tổng quan về người dùng, nội dung, trường...",
    icon: <BarChart className="h-8 w-8 text-orange-500 transition-transform group-hover:scale-110" />,
    href: "/admin/analytics",
    color: "bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/40 dark:to-gray-900 border border-orange-100 dark:border-orange-700",
  },
];

const recentActivities = [
  {
    icon: <UserCog className="h-5 w-5 text-blue-500" />,
    content: "Admin đã phân quyền cho tài khoản user123.",
    time: "5 phút trước",
  },
  {
    icon: <FileText className="h-5 w-5 text-purple-500" />,
    content: "Admin đã xóa 1 đánh giá vi phạm.",
    time: "1 giờ trước",
  },
  {
    icon: <School className="h-5 w-5 text-green-500" />,
    content: "Admin đã cập nhật thông tin trường Đại học Quốc gia.",
    time: "2 giờ trước",
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    content: "Admin đã xử lý 1 báo cáo nội dung không phù hợp.",
    time: "3 giờ trước",
  },
  {
    icon: <BarChart className="h-5 w-5 text-orange-500" />,
    content: "Admin đã xem thống kê hệ thống.",
    time: "Hôm qua",
  },
];

export default function DashboardPage() {
  const { profile } = useUserProfile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <AppHeader />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">
        {/* Greeting */}
        <div className="flex items-center gap-4 mb-10">
          <img
            src={profile?.avatarUrl || "/default-avatar.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-primary shadow-xl object-cover hover:scale-105 transition-transform"
          />
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Xin chào, Admin!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Chào mừng bạn đến với bảng điều khiển quản trị hệ thống.
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
          {dashboardActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group rounded-xl p-6 flex flex-col gap-3 shadow-md hover:shadow-2xl transition-all duration-300 border ${action.color}`}
            >
              <div className="flex items-center gap-3 mb-1">
                {action.icon}
                <h3 className="font-semibold text-lg group-hover:underline text-gray-900 dark:text-white">
                  {action.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {action.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/50 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-800">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🕒 Hoạt động gần đây
          </h4>
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {recentActivities.map((act, idx) => (
              <li key={idx} className="flex items-center gap-4 py-3">
                <div className="shrink-0">{act.icon}</div>
                <div className="flex-1 text-gray-800 dark:text-gray-200">{act.content}</div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{act.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
