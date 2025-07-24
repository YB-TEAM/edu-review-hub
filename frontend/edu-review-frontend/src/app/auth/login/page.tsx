"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Lock, User, CheckCircle, XCircle } from "lucide-react";
import { NavbarLogo } from "@/features/landing/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import "../auth.scss";

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
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.username,
          password: formData.password,
          deviceId: "web",
          rememberMe: true,
          ip: "",
          userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
        }),
      });

      if (res.status === 401) throw new Error("Sai tài khoản hoặc mật khẩu");
      if (!res.ok) throw new Error("Đăng nhập thất bại");

      setSuccess("Đăng nhập thành công!");
      toast.success("Đăng nhập thành công!");
      setTimeout(() => window.location.href = "/", 1200);
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
      toast.error(err.message || "Đăng nhập thất bại");
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
            Sign up
          </Link>
          <button className="nav-btn active">Sign in</button>
          <button className="close-btn">×</button>
        </div>

        <h2 className="auth-title">Sign in to your account</h2>

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
              placeholder="Username"
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
              placeholder="Password"
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
            {isLoading ? <div className="loading-spinner" /> : "Sign in"}
          </Button>

          <div className="text-right mt-2">
            <Link href="/auth/forgot-password" className="auth-link">
              Quên mật khẩu?
            </Link>
          </div>
        </form>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">OR SIGN IN WITH</span>
          <div className="divider-line" />
        </div>

        <div className="social-buttons">
          <Button className="auth-btn variant-outline flex-1">
            <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </Button>
        </div>

        <p className="footer-text">
          By signing in, you agree to our{" "}
          <Link href="/terms">Terms & Service</Link>
        </p>
      </div>
    </div>
  );
}