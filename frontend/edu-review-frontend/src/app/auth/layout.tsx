import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xác thực - Edu Review Hub",
  description:
    "Đăng nhập, đăng ký và quản lý tài khoản của bạn tại Edu Review Hub",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-layout">{children}</div>;
}
