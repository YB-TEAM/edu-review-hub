"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import "./footer.scss";
import { Input } from "@/components/ui/input";

// Footer data
const FOOTER_LINKS = {
  product: [
    { label: "Tính năng", href: "#features" },
    { label: "Bảng giá", href: "#pricing" },
    { label: "Đánh giá", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
  ],
  company: [
    { label: "Về chúng tôi", href: "#about" },
    { label: "Blog", href: "/blog" },
    { label: "Tuyển dụng", href: "/careers" },
    { label: "Liên hệ", href: "#contact" },
  ],
  support: [
    { label: "Trung tâm hỗ trợ", href: "/help" },
    { label: "Liên hệ", href: "/contact" },
    { label: "Tài liệu", href: "/docs" },
    { label: "Trạng thái", href: "/status" },
  ],
  legal: [
    { label: "Chính sách bảo mật", href: "/privacy" },
    { label: "Điều khoản sử dụng", href: "/terms" },
    { label: "Cookie", href: "/cookies" },
    { label: "Bảo mật", href: "/security" },
  ],
};

const SOCIAL_LINKS = [
  { name: "Facebook", href: "#", icon: "facebook" },
  { name: "Twitter", href: "#", icon: "twitter" },
  { name: "LinkedIn", href: "#", icon: "linkedin" },
  { name: "Instagram", href: "#", icon: "instagram" },
  { name: "YouTube", href: "#", icon: "youtube" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer relative overflow-hidden">
      {/* Animated Background */}
      <div className="footer__bg-animation">
        <div className="footer__bg-gradient"></div>
        <div className="footer__bg-pattern"></div>
        <div className="footer__floating-shapes">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`footer__shape footer__shape--${i + 1}`} />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Top Section - Newsletter & CTA */}
          <div className="footer__top-section mb-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="footer__title text-3xl md:text-4xl font-bold text-white mb-4">
                Sẵn sàng bắt đầu hành trình học tập?
              </h2>
              <p className="footer__subtitle text-lg text-white/80 mb-8">
                Tham gia cộng đồng hàng nghìn học viên và nhận những cập nhật
                mới nhất
              </p>

              {/* Newsletter Signup */}
              <form
                onSubmit={handleSubscribe}
                className="footer__newsletter max-w-md mx-auto"
              >
                <div className="footer__newsletter-wrapper">
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="footer__newsletter-input"
                    required
                  />
                  <Button
                    type="submit"
                    className={cn("footer__newsletter-btn", {
                      "footer__newsletter-btn--success": isSubscribed,
                    })}
                  >
                    {isSubscribed ? "✓ Đã đăng ký!" : "Đăng ký"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Links Section */}
          <div className="footer__links-section grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            {/* Logo & Description */}
            <div className="col-span-2 lg:col-span-2">
              <FooterLogo />
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Nền tảng đánh giá giáo dục hàng đầu, giúp bạn tìm kiếm và lựa
                chọn những khóa học, trường học phù hợp nhất.
              </p>
              <SocialLinks />
            </div>

            {/* Link Columns */}
            <FooterLinkColumn title="Sản phẩm" links={FOOTER_LINKS.product} />
            <FooterLinkColumn title="Công ty" links={FOOTER_LINKS.company} />
            <FooterLinkColumn title="Hỗ trợ" links={FOOTER_LINKS.support} />
            <FooterLinkColumn title="Pháp lý" links={FOOTER_LINKS.legal} />
          </div>

          {/* Stats Section */}
          <StatsSection />
        </div>

        {/* Bottom Section */}
        <div className="footer__bottom border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-white/60 text-sm">
                © 2024 EduReview. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex items-center space-x-6">
                <Link
                  href="/privacy"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Chính sách bảo mật
                </Link>
                <Link
                  href="/terms"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Điều khoản
                </Link>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <span>Được tạo với</span>
                  <span className="text-red-400 animate-pulse">❤️</span>
                  <span>tại Việt Nam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Sub-components
function FooterLogo() {
  return (
    <Link
      href="/"
      className="footer__logo inline-flex items-center space-x-3 mb-6"
    >
      <div className="footer__logo-icon w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-xl">E</span>
      </div>
      <span className="footer__logo-text text-2xl font-bold text-white">
        EduReview
      </span>
    </Link>
  );
}

function SocialLinks() {
  return (
    <div className="footer__social flex space-x-4">
      {SOCIAL_LINKS.map((social) => (
        <Link
          key={social.name}
          href={social.href}
          className="footer__social-link"
          aria-label={social.name}
        >
          <SocialIcon name={social.icon} />
        </Link>
      ))}
    </div>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons = {
    facebook:
      "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    twitter:
      "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
    linkedin:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    instagram:
      "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    youtube:
      "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  };

  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d={icons[name as keyof typeof icons]} />
    </svg>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="footer__link-column">
      <h3 className="footer__link-title text-white font-semibold text-sm uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="footer__link text-white/70 hover:text-white text-sm transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { number: "50K+", label: "Học viên" },
    { number: "1K+", label: "Khóa học" },
    { number: "500+", label: "Trường học" },
    { number: "98%", label: "Hài lòng" },
  ];

  return (
    <div className="footer__stats grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/10">
      {stats.map((stat, index) => (
        <div key={index} className="footer__stat text-center">
          <div className="footer__stat-number text-3xl md:text-4xl font-bold text-white mb-2">
            {stat.number}
          </div>
          <div className="footer__stat-label text-white/70 text-sm uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
