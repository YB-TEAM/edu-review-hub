"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Mail, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "expired"
  >("loading");
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Mock API call - replace with actual API
  const verifyEmail = async (token: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response - replace with actual API call
      // const response = await fetch('/api/auth/verify-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token })
      // });

      // if (!response.ok) throw new Error('Verification failed');

      // Mock success
      if (token === "valid-token") {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("error");
      }
    } catch {
      setVerificationStatus("error");
    }
  };

  const resendVerificationEmail = async () => {
    setIsResending(true);
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // const response = await fetch('/api/auth/resend-verification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setCountdown(60);
      setIsResending(false);
    } catch {
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">
              Đang xác minh email...
            </h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Xác minh thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Email của bạn đã được xác minh. Bây giờ bạn có thể đăng nhập vào
              tài khoản.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Xác minh thất bại
            </h2>
            <p className="text-gray-600 mb-6">
              Link xác minh không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi
              lại email xác minh.
            </p>
            <button
              onClick={resendVerificationEmail}
              disabled={isResending || countdown > 0}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : countdown > 0 ? (
                `Gửi lại sau ${countdown}s`
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi lại email xác minh
                </>
              )}
            </button>
          </div>
        );

      case "expired":
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-orange-600 mb-2">
              Link đã hết hạn
            </h2>
            <p className="text-gray-600 mb-6">
              Link xác minh này đã hết hạn. Vui lòng yêu cầu gửi lại email xác
              minh mới.
            </p>
            <div className="space-y-3">
              <button
                onClick={resendVerificationEmail}
                disabled={isResending || countdown > 0}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : countdown > 0 ? (
                  `Gửi lại sau ${countdown}s`
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Gửi lại email xác minh
                  </>
                )}
              </button>
              <div>
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Xác minh Email
            </h1>
            <p className="text-gray-600">
              {email && `Đang xác minh email: ${email}`}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
