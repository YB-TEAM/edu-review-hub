"use client";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-5xl mx-auto w-full px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý người dùng</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-800">
          <div className="text-gray-500 dark:text-gray-300 mb-4">Danh sách người dùng (placeholder)</div>
          {/* TODO: Table user, actions thêm/sửa/xóa */}
          <div className="h-40 flex items-center justify-center text-gray-400">(Bảng danh sách user sẽ hiển thị ở đây)</div>
        </div>
      </div>
    </div>
  );
} 