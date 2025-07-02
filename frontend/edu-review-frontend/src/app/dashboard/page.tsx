"use client";
import { AppHeader } from "@/components/app/AppHeader";
import { AppFooter } from "@/components/app/AppFooter";
import { useUserProfile } from "@/hooks/useUserProfile";
import Link from "next/link";
import {
  Star,
  Edit,
  Filter,
  AlertTriangle,
  ShieldCheck,
  PlusCircle,
  Clock,
} from "lucide-react";

const dashboardActions = [
  {
    title: "Gửi đánh giá trường đại học",
    description: "Chia sẻ cảm nhận, trải nghiệm về trường bạn đã học.",
    icon: <PlusCircle className="h-8 w-8 text-primary" />,
    href: "/reviews/new",
    color:
      "bg-primary/10 border-primary/20 dark:bg-primary/20 dark:border-primary/30",
  },
  {
    title: "Chấm điểm trường (1–5 sao)",
    description:
      "Đánh giá các tiêu chí: cơ sở vật chất, giảng viên, môi trường...",
    icon: <Star className="h-8 w-8 text-yellow-500" />,
    href: "/reviews/rate",
    color:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700/40",
  },
  {
    title: "Quản lý đánh giá của bạn",
    description: "Xem, chỉnh sửa hoặc xóa các đánh giá bạn đã gửi.",
    icon: <Edit className="h-8 w-8 text-blue-500" />,
    href: "/reviews/my",
    color:
      "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700/40",
  },
  {
    title: "Duyệt & lọc đánh giá",
    description: "Xem tất cả đánh giá, lọc theo trường, điểm, ngày...",
    icon: <Filter className="h-8 w-8 text-green-500" />,
    href: "/reviews/browse",
    color:
      "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700/40",
  },
  {
    title: "Báo cáo đánh giá không phù hợp",
    description: "Gửi báo cáo về các đánh giá vi phạm hoặc spam.",
    icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
    href: "/reviews/report",
    color: "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700/40",
  },
  {
    title: "Xác minh tình trạng sinh viên",
    description:
      "Xác thực bạn là sinh viên thực sự của trường để tăng độ tin cậy.",
    icon: <ShieldCheck className="h-8 w-8 text-indigo-500" />,
    href: "/profile/verify-student",
    color:
      "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-700/40",
  },
];

const recentActivities = [
  {
    icon: <Clock className="h-5 w-5 text-primary" />,
    content: "Bạn đã gửi đánh giá cho Đại học Bách Khoa.",
    time: "2 giờ trước",
  },
  {
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    content: "Bạn đã chấm điểm Đại học Kinh tế Quốc dân.",
    time: "1 ngày trước",
  },
  {
    icon: <Edit className="h-5 w-5 text-blue-500" />,
    content: "Bạn đã chỉnh sửa đánh giá cho Đại học Ngoại thương.",
    time: "3 ngày trước",
  },
];

export default function DashboardPage() {
  const { profile } = useUserProfile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* App Header */}
      <AppHeader />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">
        {/* Greeting user section */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={profile?.avatarUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full border-4 border-primary shadow object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Xin chào, {profile?.name || "User"}!
            </h2>
            <div className="text-gray-500 dark:text-gray-300 text-sm">
              Chào mừng bạn trở lại với dashboard đánh giá đại học.
            </div>
          </div>
        </div>

        {/* Dashboard actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dashboardActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group border rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer ${action.color}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {action.icon}
                <span className="font-semibold text-lg group-hover:underline text-gray-900 dark:text-white">
                  {action.title}
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm flex-1">
                {action.description}
              </div>
            </Link>
          ))}
        </div>

        {/* Recent activities */}
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Hoạt động gần đây
          </h3>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentActivities.map((act, idx) => (
              <li key={idx} className="flex items-center gap-3 py-3">
                {act.icon}
                <span className="flex-1 text-gray-700 dark:text-gray-200">
                  {act.content}
                </span>
                <span className="text-xs text-gray-400">{act.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* App Footer */}
      <AppFooter />
    </div>
  );
}
