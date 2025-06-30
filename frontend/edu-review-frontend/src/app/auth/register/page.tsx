"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import "../auth.scss";

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

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
      // Handle registration logic here
    }, 2000);
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
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
            Bắt đầu hành trình!
          </h1>
          <p className="text-gray-600">
            Tạo tài khoản để khám phá trường đại học phù hợp
          </p>
        </div>

        {/* Progress Bar */}
        <div
          className={cn(
            "mb-6 transition-all duration-1000 delay-200 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span className={step >= 1 ? "text-primary-600 font-semibold" : ""}>
              Thông tin cơ bản
            </span>
            <span className={step >= 2 ? "text-primary-600 font-semibold" : ""}>
              Xác thực
            </span>
          </div>
        </div>

        {/* Registration Form */}
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
            {step === 1 && (
              <>
                {/* Full Name Field */}
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Họ và tên
                  </label>
                  <div className="input-wrapper">
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên đầy đủ"
                      className="form-input"
                      required
                    />
                    <div className="input-icon">👤</div>
                  </div>
                </div>

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

                {/* Phone Field */}
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Số điện thoại
                  </label>
                  <div className="input-wrapper">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      className="form-input"
                      required
                    />
                    <div className="input-icon">📱</div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="auth-submit-btn w-full"
                  disabled={
                    !formData.fullName || !formData.email || !formData.phone
                  }
                >
                  <span className="btn-icon">➡️</span>
                  Tiếp tục
                </Button>
              </>
            )}

            {step === 2 && (
              <>
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
                      placeholder="Tạo mật khẩu mạnh"
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
                  <div className="password-strength mt-2">
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width: `${Math.min(
                            formData.password.length * 10,
                            100
                          )}%`,
                          backgroundColor:
                            formData.password.length < 6
                              ? "#ef4444"
                              : formData.password.length < 8
                              ? "#f59e0b"
                              : "#10b981",
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.password.length < 6
                        ? "Mật khẩu yếu"
                        : formData.password.length < 8
                        ? "Mật khẩu trung bình"
                        : "Mật khẩu mạnh"}
                    </p>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Xác nhận mật khẩu
                  </label>
                  <div className="input-wrapper">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Nhập lại mật khẩu"
                      className="form-input"
                      required
                    />
                    <div className="input-icon">🔐</div>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="password-toggle"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        Mật khẩu không khớp
                      </p>
                    )}
                </div>

                {/* Terms and Conditions */}
                <div className="form-group">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox mt-1"
                      required
                    />
                    <span className="text-sm text-gray-600">
                      Tôi đồng ý với{" "}
                      <Link
                        href="/terms"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Điều khoản sử dụng
                      </Link>{" "}
                      và{" "}
                      <Link
                        href="/privacy"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Chính sách bảo mật
                      </Link>
                    </span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1"
                  >
                    <span className="btn-icon">⬅️</span>
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !formData.password ||
                      !formData.confirmPassword ||
                      formData.password !== formData.confirmPassword
                    }
                    className="auth-submit-btn flex-1"
                  >
                    {isLoading ? (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Đang tạo tài khoản...</span>
                      </div>
                    ) : (
                      <>
                        <span className="btn-icon">✨</span>
                        Tạo tài khoản
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>

          {/* Divider */}
          <div className="divider">
            <span>hoặc</span>
          </div>

          {/* Social Registration */}
          <div className="social-login">
            <Button variant="outline" className="social-btn google-btn">
              <span className="social-icon">🔍</span>
              Đăng ký với Google
            </Button>
            <Button variant="outline" className="social-btn facebook-btn">
              <span className="social-icon">📘</span>
              Đăng ký với Facebook
            </Button>
          </div>
        </div>

        {/* Login Link */}
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
            Đã có tài khoản?{" "}
            <Link
              href="/auth/login"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
