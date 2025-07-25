"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail, RefreshCw } from "lucide-react";
import { NavbarLogo } from "@/features/landing/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import "../auth.scss";
import { useVerifyEmailMutation, useResendVerificationMutation } from "@/lib/services/authApi";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "expired"
  >("loading");
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const [verifyEmailApi] = useVerifyEmailMutation();
  const [resendVerificationApi] = useResendVerificationMutation();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const verifyEmail = async (token: string) => {
    try {
      if (!email) throw new Error("Không tìm thấy email");
      await verifyEmailApi({ email, otp: token }).unwrap();
      setVerificationStatus("success");
      toast.success("Xác minh email thành công!");
    } catch {
      setVerificationStatus("error");
    }
  };

  const resendVerificationEmail = async () => {
    setIsResending(true);
    try {
      if (!email) throw new Error("Không tìm thấy email");
      await resendVerificationApi({ email }).unwrap();
      setCountdown(60);
      toast.success("Đã gửi email xác minh!");
    } catch {
      toast.error("Gửi email xác minh thất bại");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus("expired");
    }
  }, [token]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
          <div className="success-container">
            <CheckCircle className="success-icon" />
            <h2 className="success-title">Xác minh thành công!</h2>
            <p className="success-description">
              Email của bạn đã được xác minh. Bây giờ bạn có thể đăng nhập vào tài khoản.
            </p>
            <Link href="/auth/login">
              <Button className="auth-btn">
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        );

      case "error":
        return (
          <div className="error-container">
            <XCircle className="error-icon" />
            <h2 className="error-title">Xác minh thất bại</h2>
            <p className="error-description">
              Link xác minh không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác minh.
            </p>
            <Button
              onClick={resendVerificationEmail}
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
                  Gửi lại email xác minh
                </>
              )}
            </Button>
          </div>
        );

      case "expired":
        return (
          <div className="error-container">
            <XCircle className="error-icon text-orange-500" />
            <h2 className="error-title text-orange-600">Link đã hết hạn</h2>
            <p className="error-description">
              Link xác minh này đã hết hạn. Vui lòng yêu cầu gửi lại email xác minh mới.
            </p>
            <div className="space-y-3">
              <Button
                onClick={resendVerificationEmail}
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
                    Gửi lại email xác minh
                  </>
                )}
              </Button>
              <div>
                <Link href="/auth/login" className="auth-link">
                  Quay lại đăng nhập
                </Link>
              </div>
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
        <div className="text-center mb-8">
          <h1 className="auth-title">
            Xác minh email
          </h1>
          {email && (
            <p className="text-gray-600">
              Đang xác minh email: {email}
            </p>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
}