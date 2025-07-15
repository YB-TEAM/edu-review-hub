"use client";
import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="w-full border-t border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 py-4 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>
          &copy; {new Date().getFullYear()} EduReview. All rights reserved.
        </div>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link href="/support" className="hover:underline">
            Hỗ trợ
          </Link>
          <Link href="/terms" className="hover:underline">
            Điều khoản
          </Link>
          <Link href="/privacy" className="hover:underline">
            Bảo mật
          </Link>
        </div>
      </div>
    </footer>
  );
}
