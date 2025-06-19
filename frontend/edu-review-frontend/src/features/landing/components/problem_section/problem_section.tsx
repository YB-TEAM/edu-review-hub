"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import "./problem_section.scss";

export function ProblemSection() {
  const [isVisible, setIsVisible] = useState(false);
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

  const painPoints = [
    {
      icon: "❓",
      title: "Thiếu thông tin thật",
      description:
        "Chỉ có thông tin chung chung, không biết thực tế như thế nào",
    },
    {
      icon: "🏫",
      title: "Không hiểu văn hóa trường",
      description: "Không biết môi trường học tập, sinh hoạt có phù hợp không",
    },
    {
      icon: "⚠️",
      title: "Nguy cơ chọn sai ngành",
      description: "Chọn theo xu hướng mà không phù hợp với bản thân",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="problem-statement relative py-20 lg:py-32 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="problem-statement__bg-animation">
        <div className="problem-statement__bg-gradient"></div>
        <div className="problem-statement__floating-shapes">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`problem-statement__shape problem-statement__shape--${
                i + 1
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Question */}
        <div className="text-center mb-16">
          <h2
            className={cn(
              "problem-statement__title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-1000 transform",
              {
                "translate-y-0 opacity-100": isVisible,
                "translate-y-10 opacity-0": !isVisible,
              }
            )}
          >
            Bạn có đang{" "}
            <span className="problem-statement__highlight bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              băn khoăn
            </span>
            <br />
            không biết chọn trường nào?
          </h2>

          {/* Statistics */}
          <div
            className={cn(
              "problem-statement__stat-card inline-flex items-center justify-center px-8 py-4 rounded-2xl backdrop-blur-lg border transition-all duration-1000 delay-300 transform",
              {
                "translate-y-0 opacity-100": isVisible,
                "translate-y-10 opacity-0": !isVisible,
              }
            )}
          >
            <div className="text-center">
              <div className="problem-statement__stat-number text-4xl md:text-5xl font-bold mb-2">
                85%
              </div>
              <div className="problem-statement__stat-text text-lg md:text-xl font-medium">
                học sinh không biết trường nào phù hợp với mình
              </div>
            </div>
          </div>
        </div>

        {/* Pain Points */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className={cn(
                "problem-statement__pain-point group transition-all duration-1000 transform",
                {
                  "translate-y-0 opacity-100": isVisible,
                  "translate-y-10 opacity-0": !isVisible,
                }
              )}
              style={{ transitionDelay: `${600 + index * 200}ms` }}
            >
              <div className="problem-statement__pain-card relative p-8 rounded-2xl backdrop-blur-lg border h-full">
                {/* Icon */}
                <div className="problem-statement__pain-icon text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {point.icon}
                </div>

                {/* Content */}
                <h3 className="problem-statement__pain-title text-xl md:text-2xl font-bold mb-4">
                  {point.title}
                </h3>
                <p className="problem-statement__pain-description text-gray-600 leading-relaxed">
                  {point.description}
                </p>

                {/* Hover Effect */}
                <div className="problem-statement__pain-hover absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={cn(
            "text-center mt-16 transition-all duration-1000 delay-1000 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <p className="problem-statement__cta-text text-xl md:text-2xl font-medium mb-2">
            Đừng lo! Chúng tôi có giải pháp cho bạn 👇
          </p>
        </div>
      </div>
    </section>
  );
}
