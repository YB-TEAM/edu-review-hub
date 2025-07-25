"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Phone, KeyRound, CheckCircle, XCircle } from "lucide-react";
import { NavbarLogo } from "@/features/landing/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import "../auth.scss";
import { useRegisterMutation, useVerifyEmailMutation, useResendVerificationMutation } from "@/lib/services/authApi";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpFields, setOtpFields] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [verifyEmail, { isLoading: isVerifyLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResendLoading }] = useResendVerificationMutation();

  const validateStep1 = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return false;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      setError("Email không hợp lệ.");
      return false;
    }
    if (!/^.{8,}$/.test(formData.password) ||
        !/[A-Z]/.test(formData.password) ||
        !/[a-z]/.test(formData.password) ||
        !/\d/.test(formData.password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Mật khẩu phải >=8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt.");
      return false;
    }
    setError("");
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      }).unwrap();
      setStep(2);
      setSuccess("Mã OTP đã được gửi về email của bạn.");
    } catch (err: any) {
      setError(err?.data?.message || err.message || "Email hoặc tên đăng nhập đã tồn tại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");
    setSuccess("");

    const otp = otpFields.join("");
    
    try {
      if (!/^[0-9]{6}$/.test(otp)) throw new Error("OTP phải gồm 6 số.");

      await verifyEmail({ email: formData.email, otp }).unwrap();
      setSuccess("Xác thực thành công! Bạn có thể đăng nhập.");
      toast.success("Đăng ký thành công!", { description: "Bạn có thể đăng nhập." });
      setTimeout(() => window.location.href = "/auth/login", 1500);
    } catch (err: any) {
      setOtpError(err?.data?.message || err.message || "OTP không đúng hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError("");

    try {
      await resendVerification({ email: formData.email }).unwrap();
      toast.success("Đã gửi lại OTP về email!");
    } catch (err: any) {
      setOtpError(err?.data?.message || err.message || "Không thể gửi lại OTP");
    } finally {
      setResendLoading(false);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <button className="nav-btn active">Đăng ký</button>
          <Link href="/auth/login" className="nav-btn inactive">
            Đăng nhập
          </Link>
          <button className="close-btn">×</button>
        </div>

        <h2 className="auth-title">
          {step === 1 ? "Tạo tài khoản" : "Xác thực email"}
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
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-group">
              <User className="input-icon" />
              <Input
                name="username"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={e => handleInputChange('username', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <Phone className="input-icon" />
              <Input
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <Mail className="input-icon" />
              <Input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <Lock className="input-icon" />
              <Input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                className="form-input"
              />
            </div>

            <Button
              type="submit"
              className="auth-btn"
              disabled={isLoading}
            >
              {isLoading ? <div className="loading-spinner" /> : "Tạo tài khoản"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                {isLoading ? <div className="loading-spinner" /> : "Verify OTP"}
              </Button>

              <Button
                type="button"
                className="auth-btn variant-ghost"
                onClick={handleResendOtp}
                disabled={resendLoading}
              >
                {resendLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Gửi lại mã OTP
              </Button>
            </div>
          </form>
        )}

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">HOẶC ĐĂNG KÝ BẰNG</span>
          <div className="divider-line" />
        </div>

        <div className="social-buttons">
          <Button className="auth-btn variant-outline flex-1">
            <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </Button>
        </div>

        <p className="footer-text">
          Khi đăng ký, bạn đồng ý với <Link href="/terms">Điều khoản & Dịch vụ</Link>
        </p>
      </div>
    </div>
  );
}