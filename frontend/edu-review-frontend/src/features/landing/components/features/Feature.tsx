"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import "./features.scss";

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  details: string[];
  color: string;
  gradient: string;
}

const FEATURES: Feature[] = [
  {
    id: "personality-test",
    icon: "🧠",
    title: "Test tính cách thông minh",
    description:
      "Phân tích sâu tính cách và sở thích để đưa ra gợi ý chính xác nhất",
    details: [
      "16 loại tính cách MBTI",
      "Phân tích sở thích học tập",
      "Đánh giá khả năng thích ứng",
      "Gợi ý ngành nghề phù hợp",
    ],
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "real-reviews",
    icon: "⭐",
    title: "Đánh giá thật từ sinh viên",
    description:
      "Hàng nghìn review chân thực từ sinh viên đang học và đã tốt nghiệp",
    details: [
      "Review được xác thực",
      "Đánh giá đa chiều",
      "Cập nhật liên tục",
      "Lọc theo ngành học",
    ],
    color: "orange",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "smart-matching",
    icon: "🎯",
    title: "Gợi ý thông minh",
    description:
      "AI phân tích và đưa ra danh sách trường phù hợp với profile của bạn",
    details: [
      "Thuật toán AI tiên tiến",
      "Phân tích đa yếu tố",
      "Ranking theo độ phù hợp",
      "Cập nhật theo thời gian thực",
    ],
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "comprehensive-data",
    icon: "📊",
    title: "Dữ liệu toàn diện",
    description: "Thông tin chi tiết về 500+ trường đại học trên toàn quốc",
    details: [
      "Thông tin tuyển sinh",
      "Học phí và chi phí",
      "Cơ sở vật chất",
      "Tỷ lệ việc làm sau tốt nghiệp",
    ],
    color: "green",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "career-guidance",
    icon: "🚀",
    title: "Định hướng nghề nghiệp",
    description:
      "Tư vấn lộ trình phát triển sự nghiệp từ khi còn ngồi trên ghế nhà trường",
    details: [
      "Lộ trình học tập",
      "Kỹ năng cần thiết",
      "Cơ hội việc làm",
      "Mức lương trung bình",
    ],
    color: "indigo",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "community",
    icon: "👥",
    title: "Cộng đồng hỗ trợ",
    description:
      "Kết nối với sinh viên, cựu sinh viên và chuyên gia trong ngành",
    details: [
      "Forum thảo luận",
      "Mentor 1-1",
      "Sự kiện networking",
      "Chia sẻ kinh nghiệm",
    ],
    color: "teal",
    gradient: "from-teal-500 to-cyan-500",
  },
];

export function Features() {
  const [visibleFeatures, setVisibleFeatures] = useState<Set<string>>(
    new Set()
  );
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureId = entry.target.getAttribute("data-feature-id");
            if (featureId) {
              setVisibleFeatures((prev) => new Set([...prev, featureId]));
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const featureElements = document.querySelectorAll("[data-feature-id]");
    featureElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="features-section py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <span className="mr-2">✨</span>
            Tính năng nổi bật
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tại sao chọn{" "}
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              EduReview?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi kết hợp công nghệ AI tiên tiến với dữ liệu thực tế để mang
            đến trải nghiệm tìm kiếm trường đại học tốt nhất cho bạn
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              isVisible={visibleFeatures.has(feature.id)}
              isActive={activeFeature === feature.id}
              onHover={() => setActiveFeature(feature.id)}
              onLeave={() => setActiveFeature(null)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Sẵn sàng khám phá tương lai của bạn?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Hãy bắt đầu với bài test tính cách miễn phí ngay hôm nay
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 hover:scale-105 transform">
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  isVisible,
  isActive,
  onHover,
  onLeave,
}: {
  feature: Feature;
  index: number;
  isVisible: boolean;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      data-feature-id={feature.id}
      className={cn(
        "feature-card group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100",
        {
          "feature-card--visible": isVisible,
          "feature-card--active": isActive,
        }
      )}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Subtle Background Gradient - Much lighter */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 rounded-2xl",
          feature.gradient
        )}
      />

      {/* Enhanced Border Effect on Hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          feature.gradient
        )}
        style={{
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Icon */}
      <div
        className={cn(
          "feature-card__icon w-16 h-16 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br relative z-10",
          feature.gradient,
          "text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
        )}
      >
        {feature.icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-gray-600 group-hover:text-gray-700 mb-4 leading-relaxed transition-colors duration-300">
          {feature.description}
        </p>

        {/* Feature Details */}
        <ul className="space-y-2">
          {feature.details.map((detail, idx) => (
            <li
              key={idx}
              className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300"
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full mr-3 bg-gradient-to-r flex-shrink-0",
                  feature.gradient
                )}
              />
              <span className="leading-relaxed">{detail}</span>
            </li>
          ))}
        </ul>

        {/* Hover Indicator */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div
            className={cn(
              "inline-flex items-center text-sm font-medium bg-gradient-to-r bg-clip-text text-transparent",
              feature.gradient
            )}
          >
            Tìm hiểu thêm
            <svg
              className="w-4 h-4 ml-1 text-current"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
