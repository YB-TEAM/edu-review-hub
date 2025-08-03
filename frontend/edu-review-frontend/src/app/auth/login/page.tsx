"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Loader2, Lock, User, CheckCircle, XCircle } from "lucide-react";
import { NavbarLogo } from "@/features/landing/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/lib/slices/authSlice";
import "../auth.scss";
import { useLoginMutation } from "@/lib/services/authApi";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await login({
        identifier: formData.username,
        password: formData.password,
      }).unwrap();
      
      // Lưu token vào Redux store
      dispatch(setAuth(result));
      
      // Debug: Log Redux state
      console.log("Login successful, Redux state:", result);
      
      setSuccess("Đăng nhập thành công!");
      toast.success("Đăng nhập thành công!");
      setTimeout(() => router.push("/"), 1200);
    } catch (err: any) {
      let errorMessage = "Đăng nhập thất bại";
      
      // Xử lý lỗi 403 - Email chưa xác thực
      if (err?.status === 403 || err?.data?.message?.includes("email")) {
        errorMessage = "Email chưa được xác thực. Vui lòng kiểm tra email và xác thực tài khoản.";
        
        // Lưu username và tạo email tự động
        const username = formData.username;
        let email = username;
        
        // Nếu username không có @, thêm @gmail.com
        if (!email.includes("@")) {
          email = `${username}@gmail.com`;
        }
        
        // Lưu email vào localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("pendingVerificationEmail", email);
        }
        
        toast.error(errorMessage, {
          description: "Chuyển hướng đến trang xác thực email...",
        });
        setTimeout(() => router.push("/auth/verify-email"), 2000);
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
            Đăng ký
          </Link>
          <button className="nav-btn active">Đăng nhập</button>
          <button className="close-btn">×</button>
        </div>

        <h2 className="auth-title">Đăng nhập vào tài khoản</h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <User className="input-icon" />
            <Input
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <Lock className="input-icon" />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
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

          <Button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? <div className="loading-spinner" /> : "Đăng nhập"}
          </Button>

          <div className="text-right mt-2">
            <Link href="/auth/forgot-password" className="auth-link">
              Quên mật khẩu?
            </Link>
          </div>
        </form>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">HOẶC ĐĂNG NHẬP BẰNG</span>
          <div className="divider-line" />
        </div>

        <div className="social-buttons">
          <Button className="auth-btn variant-outline flex-1">
            <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </Button>
        </div>

        <p className="footer-text">
          Khi đăng nhập, bạn đồng ý với <Link href="/terms">Điều khoản & Dịch vụ</Link>
        </p>
      </div>
    </div>
  );
}