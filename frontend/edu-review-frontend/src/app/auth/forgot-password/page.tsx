"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, Lock, KeyRound, CheckCircle, XCircle, User } from "lucide-react";
import { NavbarLogo } from "@/features/landing/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import "../auth.scss";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [otpFields, setOtpFields] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpError, setOtpError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const router = useRouter();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE}/api/v1/email-verification/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Không thể gửi email đặt lại mật khẩu");

      setStep(2);
      setSuccess("Đã gửi mã OTP về email của bạn.");
      toast.success("Đã gửi mã OTP về email!");
    } catch (err: any) {
      setError(err.message || "Không thể gửi email đặt lại mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");
    setSuccess("");

    const otp = otpFields.join("");

    try {
      if (!/^[0-9]{6}$/.test(otp)) throw new Error("OTP phải gồm 6 số.");
      if (!/^.{8,}$/.test(newPassword) ||
          !/[A-Z]/.test(newPassword) ||
          !/[a-z]/.test(newPassword) ||
          !/\d/.test(newPassword) ||
          !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        throw new Error("Mật khẩu phải >=8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt.");
      }

      const res = await fetch(`${API_BASE}/api/v1/email-verification/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!res.ok) throw new Error("OTP không đúng hoặc đã hết hạn.");

      setSuccess("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập.");
      toast.success("Đặt lại mật khẩu thành công!");
      setTimeout(() => window.location.href = "/auth/login", 1500);
    } catch (err: any) {
      setOtpError(err.message || "OTP không đúng hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    
    const newOtp = [...otpFields];
    newOtp[idx] = value;
    setOtpFields(newOtp);

    if (value && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
    if (!value && idx > 0) {
      const prev = document.getElementById(`otp-${idx - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

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
        <div className="auth-header">
          <Link href="/auth/register" className="nav-btn inactive">
            Sign up
          </Link>
          <button className="nav-btn active">Forgot password</button>
          <button className="close-btn">×</button>
        </div>

        <h2 className="auth-title">
          {step === 1 ? "Forgot your password?" : "Reset your password"}
        </h2>

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

        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="form-group">
              <Mail className="input-icon" />
              <Input
                name="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <Button
              type="submit"
              className="auth-btn"
              disabled={isLoading}
            >
              {isLoading ? <div className="loading-spinner" /> : "Send reset email"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="otp-container">
              <KeyRound className="otp-icon" />
              <div className="otp-inputs">
                {otpFields.map((value, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    className="otp-input"
                  />
                ))}
              </div>

              <div className="form-group mt-4 w-full">
                <Lock className="input-icon" />
                <Input
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {otpError && (
                <div className="alert error">
                  <XCircle className="w-5 h-5" />
                  {otpError}
                </div>
              )}

              <Button
                type="submit"
                className="auth-btn"
                disabled={isLoading}
              >
                {isLoading ? <div className="loading-spinner" /> : "Reset password"}
              </Button>
            </div>
          </form>
        )}

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">OR SIGN IN</span>
          <div className="divider-line" />
        </div>

        <div className="social-buttons">
          <Link href="/auth/login" className="flex-1">
            <Button className="auth-btn variant-outline w-full">
              <User className="w-5 h-5 mr-2" />
              Login
            </Button>
          </Link>
        </div>

        <p className="footer-text">
          By resetting password, you agree to our{" "}
          <Link href="/terms">Terms & Service</Link>
        </p>
      </div>
    </div>
  );
}