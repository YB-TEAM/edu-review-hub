"use client";
import { UserProfile } from "@/hooks/useUserProfile";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";

export function AvatarDropdown({ profile }: { profile?: UserProfile | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!profile) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 focus:outline-none group"
        onClick={() => setOpen((v) => !v)}
        aria-label="Tài khoản"
      >
        <img
          src={profile.avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow group-hover:scale-105 transition-transform"
        />
        <span className="hidden md:block font-medium text-gray-900 dark:text-white">
          {profile.name}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4" /> Hồ sơ cá nhân
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4" /> Cài đặt
          </Link>
          <button
            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 dark:hover:bg-gray-800 text-red-600 dark:text-red-400"
            onClick={() => {
              setOpen(false);
              // TODO: Thêm logic logout thực tế
              alert("Đăng xuất thành công (mock)");
            }}
          >
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
