"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import "../auth.scss";

export default function ForgotPasswordPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
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
          {/* Success Message */}
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
              <div className="logo-icon success-icon">✅</div>
            </div>
            <h1 className="text-3xl font-bold text-primary-900 mb-2">
              Email đã được gửi!
            </h1>
            <p className="text-gray-600">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn
            </p>
          </div>

          {/* Success Card */}
          <div
            className={cn(
              "auth-card transition-all duration-1000 delay-300 transform",
              {
                "translate-y-0 opacity-100": isVisible,
                "translate-y-10 opacity-0": !isVisible,
              }
            )}
          >
            <div className="text-center space-y-4">
              <div className="success-animation">
                <div className="checkmark">✓</div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary-900">
                  Kiểm tra email của bạn
                </h3>
                <p className="text-gray-600 text-sm">
                  Chúng tôi đã gửi email đến <strong>{email}</strong> với hướng
                  dẫn đặt lại mật khẩu.
                </p>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-primary-600 text-lg">💡</div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-primary-900 mb-1">
                      Không nhận được email?
                    </p>
                    <ul className="text-xs text-primary-700 space-y-1">
                      <li>• Kiểm tra thư mục spam</li>
                      <li>• Đảm bảo email được nhập chính xác</li>
                      <li>• Thử lại sau vài phút</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3 pt-4">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="auth-submit-btn"
                >
                  <span className="btn-icon">🔄</span>
                  Gửi lại email
                </Button>

                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    <span className="btn-icon">⬅️</span>
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="logo-icon">🔐</div>
          </div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">
            Quên mật khẩu?
          </h1>
          <p className="text-gray-600">
            Đừng lo lắng! Chúng tôi sẽ giúp bạn đặt lại mật khẩu
          </p>
        </div>

        {/* Forgot Password Form */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="form-input"
                  required
                />
                <div className="input-icon">📧</div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-secondary-600 text-lg">ℹ️</div>
                <div className="text-left">
                  <p className="text-sm font-medium text-secondary-900 mb-1">
                    Làm thế nào để đặt lại mật khẩu?
                  </p>
                  <p className="text-xs text-secondary-700">
                    Chúng tôi sẽ gửi email chứa link đặt lại mật khẩu. Link này
                    sẽ hết hạn sau 1 giờ để đảm bảo an toàn.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !email}
              className="auth-submit-btn w-full"
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Đang gửi email...</span>
                </div>
              ) : (
                <>
                  <span className="btn-icon">📤</span>
                  Gửi email đặt lại mật khẩu
                </>
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link
              href="/auth/login"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              <span className="btn-icon">⬅️</span>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div
          className={cn(
            "text-center mt-6 transition-all duration-1000 delay-500 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <p className="text-gray-600 text-sm">
            Vẫn gặp vấn đề?{" "}
            <Link
              href="/contact"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Liên hệ hỗ trợ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
