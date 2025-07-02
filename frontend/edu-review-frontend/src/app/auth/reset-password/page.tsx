"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Lock,
  RefreshCw,
} from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"email" | "reset" | "success">("email");
  const [email, setEmail] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password validation
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      setStep("reset");
    }
  }, [searchParams]);

  useEffect(() => {
    // Validate password strength
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // if (!response.ok) throw new Error('Failed to send reset email');

      setSuccess(
        "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
      );
      setCountdown(60);
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendResetEmail = async () => {
    setIsResending(true);
    setError("");

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setSuccess("Email đặt lại mật khẩu đã được gửi lại.");
      setCountdown(60);
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsResending(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    if (!Object.values(passwordStrength).every(Boolean)) {
      setError("Mật khẩu không đủ mạnh.");
      setIsLoading(false);
      return;
    }

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, password })
      // });

      // if (!response.ok) throw new Error('Failed to reset password');

      setStep("success");
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quên mật khẩu?
        </h2>
        <p className="text-gray-600">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={sendResetEmail} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nhập email của bạn"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin inline" />
              Đang gửi...
            </>
          ) : (
            "Gửi email đặt lại mật khẩu"
          )}
        </button>
      </form>

      {success && (
        <div className="text-center">
          <button
            onClick={resendResetEmail}
            disabled={isResending || countdown > 0}
            className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin inline" />
                Đang gửi...
              </>
            ) : countdown > 0 ? (
              `Gửi lại sau ${countdown}s`
            ) : (
              "Gửi lại email"
            )}
          </button>
        </div>
      )}

      <div className="text-center">
        <Link href="/auth/login" className="text-primary hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );

  const renderResetStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đặt lại mật khẩu
        </h2>
        <p className="text-gray-600">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={resetPassword} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nhập mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password strength indicator */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-xs">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  passwordStrength.length ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span
                className={
                  passwordStrength.length ? "text-green-600" : "text-gray-500"
                }
              >
                Ít nhất 8 ký tự
              </span>
            </div>
            <div className="flex items-center text-xs">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  passwordStrength.uppercase ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span
                className={
                  passwordStrength.uppercase
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                Chữ hoa
              </span>
            </div>
            <div className="flex items-center text-xs">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  passwordStrength.lowercase ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span
                className={
                  passwordStrength.lowercase
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                Chữ thường
              </span>
            </div>
            <div className="flex items-center text-xs">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  passwordStrength.number ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span
                className={
                  passwordStrength.number ? "text-green-600" : "text-gray-500"
                }
              >
                Số
              </span>
            </div>
            <div className="flex items-center text-xs">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  passwordStrength.special ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span
                className={
                  passwordStrength.special ? "text-green-600" : "text-gray-500"
                }
              >
                Ký tự đặc biệt
              </span>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            !Object.values(passwordStrength).every(Boolean) ||
            password !== confirmPassword
          }
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin inline" />
              Đang đặt lại...
            </>
          ) : (
            "Đặt lại mật khẩu"
          )}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h2 className="text-2xl font-bold text-green-600">
        Đặt lại mật khẩu thành công!
      </h2>
      <p className="text-gray-600">
        Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng
        nhập với mật khẩu mới.
      </p>
      <Link
        href="/auth/login"
        className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Đăng nhập ngay
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {step === "email" && renderEmailStep()}
          {step === "reset" && renderResetStep()}
          {step === "success" && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
}
