"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail, RefreshCw, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { NavbarLogo } from "@/features/landing/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import "../auth.scss";
import { useVerifyEmailMutation, useResendVerificationEmailMutation } from "@/lib/services/authApi";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "success" | "error" | "expired"
  >("idle");
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpFields, setOtpFields] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const [verifyEmailApi] = useVerifyEmailMutation();
  const [resendVerificationApi] = useResendVerificationEmailMutation();

  const token = searchParams.get("token");
  const emailFromParams = searchParams.get("email");
  
  // Lấy email từ URL params, Redux store, hoặc localStorage
  const getEmail = () => {
    if (emailFromParams) return emailFromParams;
    if (user?.email) return user.email;
    if (typeof window !== "undefined") {
      return localStorage.getItem("pendingVerificationEmail");
    }
    return null;
  };
  
  const email = getEmail();
  const [displayEmail, setDisplayEmail] = useState(email || "");

  // Cập nhật displayEmail khi email thay đổi
  useEffect(() => {
    if (email) {
      setDisplayEmail(email);
    }
  }, [email]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");

    const otp = otpFields.join("");
    
    try {
      if (!/^[0-9]{6}$/.test(otp)) throw new Error("OTP phải gồm 6 số.");

      await verifyEmailApi({ token: otp, email: displayEmail }).unwrap();
      setVerificationStatus("success");
      toast.success("Xác minh email thành công!");
      
      // Xóa email khỏi localStorage khi verify thành công
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingVerificationEmail");
      }

      // Redirect to login after 2 seconds
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      setVerificationStatus("error");
      let errorMessage = "OTP không đúng hoặc đã hết hạn.";
      
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setOtpError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setOtpError("");

    try {
      if (!displayEmail) {
        toast.error("Không tìm thấy email");
        return;
      }
      await resendVerificationApi({ email: displayEmail }).unwrap();
      setCountdown(60);
      toast.success("Đã gửi mã OTP mới về email!");
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Gửi email xác minh thất bại";
      setOtpError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
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

  useEffect(() => {
    if (token) {
      // Nếu có token từ URL, tự động verify
      const verifyWithToken = async () => {
        setIsLoading(true);
        try {
          await verifyEmailApi({ token, email: displayEmail }).unwrap();
          setVerificationStatus("success");
          toast.success("Xác minh email thành công!");
          
          if (typeof window !== "undefined") {
            localStorage.removeItem("pendingVerificationEmail");
          }
          
          setTimeout(() => router.push("/auth/login"), 2000);
        } catch (err: any) {
          setVerificationStatus("error");
        } finally {
          setIsLoading(false);
        }
      };
      verifyWithToken();
    } else {
      // Nếu không có token, hiển thị form nhập OTP
      setVerificationStatus("idle");
    }
  }, [token, displayEmail, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-send verification email when page loads and no token
  useEffect(() => {
    if (displayEmail && !token && verificationStatus === "idle") {
      handleResendOtp();
    }
  }, [displayEmail, token, verificationStatus]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4 w-12 h-12"></div>
            <h2 className="auth-title">
              Đang xác minh email...
            </h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 w-12 h-12 text-green-500" />
            <h2 className="auth-title text-green-600">Xác minh thành công!</h2>
            <p className="text-gray-600 mb-6">
              Email của bạn đã được xác minh. Bây giờ bạn có thể đăng nhập vào tài khoản.
            </p>
            <div className="loading-spinner mx-auto mb-4 w-8 h-8"></div>
            <p className="text-sm text-gray-500">Đang chuyển hướng...</p>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <XCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
            <h2 className="auth-title text-red-600">Xác minh thất bại</h2>
            <p className="text-gray-600 mb-6">
              Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.
            </p>
            <Button
              onClick={handleResendOtp}
              disabled={isResending || countdown > 0}
              className="auth-btn"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : countdown > 0 ? (
                `Gửi lại sau ${countdown}s`
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi lại mã OTP
                </>
              )}
            </Button>
          </div>
        );

      case "expired":
        return (
          <div className="text-center">
            <XCircle className="mx-auto mb-4 w-12 h-12 text-orange-500" />
            <h2 className="auth-title text-orange-600">Link đã hết hạn</h2>
            <p className="text-gray-600 mb-6">
              Link xác minh này đã hết hạn. Vui lòng sử dụng form bên dưới để nhập mã OTP.
            </p>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Mail className="mx-auto mb-4 w-12 h-12 text-blue-500" />
              <h2 className="auth-title">Xác minh Email</h2>
              <p className="text-gray-600">
                Chúng tôi đã gửi mã OTP 6 số đến email:
              </p>
              <p className="font-semibold text-blue-600 mt-2">{displayEmail}</p>
            </div>

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
                  {isLoading ? (
                    <div className="loading-spinner" />
                  ) : (
                    "Xác minh Email"
                  )}
                </Button>

                <Button
                  type="button"
                  className="auth-btn variant-ghost"
                  onClick={handleResendOtp}
                  disabled={isResending || countdown > 0}
                >
                  {isResending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : countdown > 0 ? (
                    `Gửi lại sau ${countdown}s`
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Gửi lại mã OTP
                </Button>
              </div>
            </form>

            <div className="text-center">
              <Link href="/auth/login" className="auth-link">
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        );
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
        {!displayEmail ? (
          <div className="text-center">
            <XCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
            <h2 className="auth-title text-red-600">Không tìm thấy email</h2>
            <p className="text-gray-600 mb-6">
              Vui lòng quay lại trang đăng nhập và thử lại.
            </p>
            <Link href="/auth/login">
              <Button className="auth-btn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <NavbarLogo isScrolled={false} onLogoClick={() => {}} />
            </div>
            {renderContent()}
          </>
        )}
      </div>
    </div>
  );
}