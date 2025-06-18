"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import "./hero_section.scss";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1
          className={cn(
            "text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          Tìm trường đại học{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
            phù hợp với bạn
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            "text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          Đánh giá thật từ sinh viên thật - Gợi ý thông minh dựa trên tính cách
          <br />
          <span className="text-blue-300">Hoàn toàn miễn phí</span>
        </p>

        {/* CTA Buttons */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-all duration-1000 delay-500 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <Button
            size="lg"
            variant="default"
            className="hero-cta-primary w-full sm:w-auto px-8 py-4 text-lg font-semibold"
          >
            🎯 Làm bài test ngay
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="hero-cta-secondary w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            📚 Khám phá trường
          </Button>
        </div>

        {/* Stats */}
        <div
          className={cn(
            "mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 transition-all duration-1000 delay-700 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
              10K+
            </div>
            <div className="text-gray-300">Sinh viên tin tưởng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
              500+
            </div>
            <div className="text-gray-300">Trường đại học</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
              95%
            </div>
            <div className="text-gray-300">Độ chính xác gợi ý</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={cn(
            "absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <div className="hero-scroll-indicator flex flex-col items-center text-white/70 hover:text-white transition-colors cursor-pointer">
            <span className="text-sm mb-2">Cuộn xuống</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
