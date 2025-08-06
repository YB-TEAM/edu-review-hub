"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Lock,
  RefreshCw,
  Mail,
} from "lucide-react";
import { NavbarLogo } from "@/features/landing/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import "../auth.scss";
import { useResetPasswordMutation } from "@/lib/services/authApi";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset" | "success">("email");
  const [email, setEmail] = useState("");
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

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [resetPasswordApi, { isLoading: isResetLoading }] = useResetPasswordMutation();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      setStep("reset");
    }
  }, [searchParams]);

  useEffect(() => {
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.");
      setCountdown(60);
      toast.success("Email đã được gửi!");
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Email đặt lại mật khẩu đã được gửi lại.");
      setCountdown(60);
      toast.success("Email đã được gửi lại!");
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
      await resetPasswordApi({ token, password }).unwrap();
      setStep("success");
      toast.success("Đặt lại mật khẩu thành công!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại sau.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <div className="text-center mb-6">
        <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="auth-title">Quên mật khẩu?</h2>
        <p className="text-gray-600">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
        </p>
      </div>

      {error && (
        <div className="alert error">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="alert success">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      <form onSubmit={sendResetEmail} className="space-y-4">
        <div className="form-group">
          <Mail className="input-icon" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            className="form-input"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="auth-btn"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Đang gửi...
            </>
          ) : (
            "Gửi email đặt lại mật khẩu"
          )}
        </Button>
      </form>

      {success && (
        <div className="text-center mt-4">
          <button
            onClick={resendResetEmail}
            disabled={isResending || countdown > 0}
            className="auth-link"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
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

      <div className="text-center mt-4">
        <Link href="/auth/login" className="auth-link">
          Quay lại đăng nhập
        </Link>
      </div>
    </>
  );

  const renderResetStep = () => (
    <>
      <div className="text-center mb-6">
        <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="auth-title">Đặt lại mật khẩu</h2>
        <p className="text-gray-600">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      {error && (
        <div className="alert error">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <form onSubmit={resetPassword} className="space-y-4">
        <div className="form-group">
          <Lock className="input-icon" />
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu mới"
            className="form-input"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="password-strength">
          <div className="strength-item">
            <div className={`strength-dot ${passwordStrength.length ? 'active' : ''}`}></div>
            <span className={`strength-text ${passwordStrength.length ? 'active' : ''}`}>
              Ít nhất 8 ký tự
            </span>
          </div>
          <div className="strength-item">
            <div className={`strength-dot ${passwordStrength.uppercase ? 'active' : ''}`}></div>
            <span className={`strength-text ${passwordStrength.uppercase ? 'active' : ''}`}>
              Chữ hoa
            </span>
          </div>
          <div className="strength-item">
            <div className={`strength-dot ${passwordStrength.lowercase ? 'active' : ''}`}></div>
            <span className={`strength-text ${passwordStrength.lowercase ? 'active' : ''}`}>
              Chữ thường
            </span>
          </div>
          <div className="strength-item">
            <div className={`strength-dot ${passwordStrength.number ? 'active' : ''}`}></div>
            <span className={`strength-text ${passwordStrength.number ? 'active' : ''}`}>
              Số
            </span>
          </div>
          <div className="strength-item">
            <div className={`strength-dot ${passwordStrength.special ? 'active' : ''}`}></div>
            <span className={`strength-text ${passwordStrength.special ? 'active' : ''}`}>
              Ký tự đặc biệt
            </span>
          </div>
        </div>

        <div className="form-group">
          <Lock className="input-icon" />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu mới"
            className="form-input"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="password-toggle"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <Button
          type="submit"
          disabled={
            isLoading ||
            !Object.values(passwordStrength).every(Boolean) ||
            password !== confirmPassword
          }
          className="auth-btn"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Đang đặt lại...
            </>
          ) : (
            "Đặt lại mật khẩu"
          )}
        </Button>
      </form>
    </>
  );

  const renderSuccessStep = () => (
    <div className="success-container">
      <CheckCircle className="success-icon" />
      <h2 className="success-title">Đặt lại mật khẩu thành công!</h2>
      <p className="success-description">
        Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng
        nhập với mật khẩu mới.
      </p>
      <Link href="/auth/login">
        <Button className="auth-btn">
          Đăng nhập ngay
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <NavbarLogo isScrolled={true} onLogoClick={() => router.push("/")} />
      </div>

      <div className="auth-background">
        <video autoPlay loop muted playsInline>
          <source src="/videos/auth-background.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="auth-card">
        {step === "email" && renderEmailStep()}
        {step === "reset" && renderResetStep()}
        {step === "success" && renderSuccessStep()}
      </div>
    </div>
  );
}