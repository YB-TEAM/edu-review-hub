"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import "./solution_overview.scss";

export function SolutionOverview() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate features
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const features = [
    {
      icon: "🎯",
      title: "Đánh giá tính cách thông minh",
      description:
        "AI phân tích tính cách, sở thích và khả năng của bạn để đưa ra gợi ý chính xác nhất",
      details: [
        "Test tính cách MBTI nâng cao",
        "Phân tích điểm mạnh, điểm yếu",
        "Đánh giá khả năng học tập",
        "Gợi ý ngành nghề phù hợp",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "📝",
      title: "Review thật từ sinh viên",
      description:
        "Hàng nghìn đánh giá chân thực từ sinh viên đang học để bạn hiểu rõ thực tế",
      details: [
        "Đánh giá chất lượng giảng dạy",
        "Môi trường học tập thực tế",
        "Cơ hội việc làm sau tốt nghiệp",
        "Chi phí sinh hoạt, học phí",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "🤝",
      title: "Cộng đồng hỗ trợ",
      description:
        "Kết nối với sinh viên, cựu sinh viên và chuyên gia tư vấn giáo dục",
      details: [
        "Hỏi đáp trực tiếp với sinh viên",
        "Chia sẻ kinh nghiệm học tập",
        "Tư vấn từ chuyên gia",
        "Nhóm thảo luận theo ngành",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "🎓",
      title: "Gợi ý cá nhân hóa",
      description:
        "Thuật toán AI học hỏi từ dữ liệu để đưa ra những gợi ý ngày càng chính xác hơn",
      details: [
        "Danh sách trường phù hợp",
        "Xếp hạng theo độ phù hợp",
        "So sánh chi tiết các trường",
        "Lộ trình học tập cá nhân",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="solution-overview relative py-20 lg:py-32 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="solution-overview__bg-animation">
        <div className="solution-overview__bg-gradient"></div>
        <div className="solution-overview__bg-pattern"></div>
        <div className="solution-overview__floating-shapes">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`solution-overview__shape solution-overview__shape--${
                i + 1
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={cn(
              "solution-overview__title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-1000 transform",
              {
                "translate-y-0 opacity-100": isVisible,
                "translate-y-10 opacity-0": !isVisible,
              }
            )}
          >
            Giải pháp{" "}
            <span className="solution-overview__highlight bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              toàn diện
            </span>
            <br />
            cho việc chọn trường
          </h2>

          <p
            className={cn(
              "solution-overview__subtitle text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 transform",
              {
                "translate-y-0 opacity-100": isVisible,
                "translate-y-10 opacity-0": !isVisible,
              }
            )}
          >
            4 trụ cột chính giúp bạn tìm được trường đại học phù hợp nhất
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "solution-overview__feature group cursor-pointer transition-all duration-1000 transform",
                {
                  "translate-y-0 opacity-100": isVisible,
                  "translate-y-10 opacity-0": !isVisible,
                  "solution-overview__feature--active": activeFeature === index,
                }
              )}
              style={{ transitionDelay: `${600 + index * 200}ms` }}
              onClick={() => setActiveFeature(index)}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="solution-overview__feature-card relative p-8 lg:p-10 rounded-3xl backdrop-blur-lg border h-full">
                {/* Icon */}
                <div className="solution-overview__feature-icon text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="solution-overview__feature-title text-2xl md:text-3xl font-bold mb-4">
                  {feature.title}
                </h3>
                <p className="solution-overview__feature-description text-gray-600 text-lg leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Details List */}
                <ul className="solution-overview__feature-details space-y-3">
                  {feature.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className={cn(
                        "flex items-center text-gray-700 transition-all duration-300",
                        {
                          "translate-x-0 opacity-100": activeFeature === index,
                          "translate-x-4 opacity-70": activeFeature !== index,
                        }
                      )}
                      style={{ transitionDelay: `${detailIndex * 100}ms` }}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mr-3 bg-gradient-to-r transition-all duration-300",
                          feature.color
                        )}
                      />
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Gradient Border */}
                <div
                  className={cn(
                    "solution-overview__feature-border absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r p-[2px]",
                    feature.color
                  )}
                >
                  <div className="w-full h-full bg-white rounded-3xl" />
                </div>

                {/* Active Indicator */}
                <div
                  className={cn(
                    "solution-overview__feature-indicator absolute top-4 right-4 w-4 h-4 rounded-full transition-all duration-300 bg-gradient-to-r",
                    feature.color,
                    {
                      "opacity-100 scale-100": activeFeature === index,
                      "opacity-0 scale-0": activeFeature !== index,
                    }
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicators */}
        <div
          className={cn(
            "flex justify-center space-x-3 mb-12 transition-all duration-1000 delay-1000 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={cn(
                "solution-overview__progress-dot w-3 h-3 rounded-full transition-all duration-300 bg-gradient-to-r",
                feature.color,
                {
                  "opacity-100 scale-125": activeFeature === index,
                  "opacity-40 scale-100 hover:opacity-70":
                    activeFeature !== index,
                }
              )}
              aria-label={`Feature ${index + 1}: ${feature.title}`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={cn(
            "text-center transition-all duration-1000 delay-1200 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <Button
            size="lg"
            className="solution-overview__cta-button px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            🚀 Khám phá ngay
          </Button>
          <p className="solution-overview__cta-subtitle text-gray-500 mt-4">
            Miễn phí 100% • Không cần đăng ký
          </p>
        </div>
      </div>
    </section>
  );
}
