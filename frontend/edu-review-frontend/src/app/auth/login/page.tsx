"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import "../auth.scss";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic here
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div
          className={cn(
            "text-center mb-8 transition-all duration-1000 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <div className="auth-logo mb-4">
            <div className="logo-icon">🎓</div>
          </div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">
            Chào mừng trở lại!
          </h1>
          <p className="text-gray-600">
            Đăng nhập để tiếp tục hành trình tìm trường
          </p>
        </div>

        {/* Login Form */}
        <div
          className={cn(
            "auth-card transition-all duration-1000 delay-300 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-wrapper">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email của bạn"
                  className="form-input"
                  required
                />
                <div className="input-icon">📧</div>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <div className="input-wrapper">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className="form-input"
                  required
                />
                <div className="input-icon">🔒</div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="form-checkbox" />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn w-full"
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Đăng nhập
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>hoặc</span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <Button variant="outline" className="social-btn google-btn">
              <span className="social-icon">🔍</span>
              Đăng nhập với Google
            </Button>
            <Button variant="outline" className="social-btn facebook-btn">
              <span className="social-icon">📘</span>
              Đăng nhập với Facebook
            </Button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div
          className={cn(
            "text-center mt-6 transition-all duration-1000 delay-500 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href="/auth/register"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
