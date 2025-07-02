"use client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { profile, error, updateProfile, deactivateAccount, deleteAccount } =
    useUserProfile();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
  });
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">
            Tài khoản đã bị xóa hoặc không tồn tại.
          </h2>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    await updateProfile(form);
    setSuccess("Cập nhật thành công!");
    setEdit(false);
    setActionLoading(false);
  };

  const handleDeactivate = async () => {
    setActionLoading(true);
    await deactivateAccount();
    setSuccess("Tài khoản đã bị vô hiệu hóa.");
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tài khoản?")) return;
    setActionLoading(true);
    await deleteAccount();
    setActionLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Hồ sơ cá nhân</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatarUrl}
            alt="avatar"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <div className="font-semibold text-lg">{profile.name}</div>
            <div className="text-gray-500 text-sm">{profile.email}</div>
            <div className="text-xs mt-1">
              Trạng thái:{" "}
              {profile.status === "active" ? (
                <span className="text-green-600 font-semibold">
                  Đang hoạt động
                </span>
              ) : (
                <span className="text-red-500 font-semibold">
                  Đã vô hiệu hóa
                </span>
              )}
            </div>
          </div>
        </div>

        {success && (
          <div className="flex items-center text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}
        {error && (
          <div className="flex items-center text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            <XCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {edit ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ tên</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center"
                disabled={actionLoading}
              >
                {actionLoading && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Lưu
              </button>
              <button
                type="button"
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                onClick={() => setEdit(false)}
                disabled={actionLoading}
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <div>
              <span className="font-medium">Họ tên:</span> {profile.name}
            </div>
            <div>
              <span className="font-medium">Số điện thoại:</span>{" "}
              {profile.phone || (
                <span className="text-gray-400">Chưa cập nhật</span>
              )}
            </div>
            <button
              className="mt-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              onClick={() => setEdit(true)}
              disabled={actionLoading}
            >
              Chỉnh sửa
            </button>
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          <button
            className="w-full bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200"
            onClick={handleDeactivate}
            disabled={actionLoading || profile.status === "inactive"}
          >
            {actionLoading && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
            )}
            Vô hiệu hóa tài khoản
          </button>
          <button
            className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
            onClick={handleDelete}
            disabled={actionLoading}
          >
            {actionLoading && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
            )}
            Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}
