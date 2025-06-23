"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import "./hero_section.scss";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Hide scroll indicator when user scrolls past hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("home");
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const heroBottom = heroRect.bottom;

        // Hide scroll indicator when hero section is mostly out of view
        if (heroBottom <= window.innerHeight * 0.3) {
          setShowScrollIndicator(false);
        } else {
          setShowScrollIndicator(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToNext = () => {
    const problemSection = document.getElementById("problem");
    if (problemSection) {
      const navbarHeight = 80;
      const elementPosition = problemSection.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  const handleStartTest = () => {
    // Navigate to solution section or test page
    const solutionSection = document.getElementById("solution");
    if (solutionSection) {
      const navbarHeight = 80;
      const elementPosition = solutionSection.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  const handleExploreSchools = () => {
    // Navigate to features section or schools page
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      const navbarHeight = 80;
      const elementPosition = featuresSection.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

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
          <span className="text-blue-300 font-semibold">
            Hoàn toàn miễn phí
          </span>
        </p>

        {/* Enhanced CTA Buttons */}
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
            onClick={handleStartTest}
            className="hero-cta-primary w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white border-0"
          >
            <span className="hero-cta-icon">🎯</span>
            Làm bài test ngay
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleExploreSchools}
            className="hero-cta-secondary w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white border-0"
          >
            <span className="hero-cta-icon">📚</span>
            Khám phá trường
          </Button>
        </div>

        {/* Enhanced Stats */}
        <div
          className={cn(
            "mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 transition-all duration-1000 delay-700 transform",
            {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            }
          )}
        >
          <div className="text-center group">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
              10K+
            </div>
            <div className="text-gray-300 group-hover:text-white transition-colors duration-300">
              Sinh viên tin tưởng
            </div>
          </div>
          <div className="text-center group">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
              500+
            </div>
            <div className="text-gray-300 group-hover:text-white transition-colors duration-300">
              Trường đại học
            </div>
          </div>
          <div className="text-center group">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
              95%
            </div>
            <div className="text-gray-300 group-hover:text-white transition-colors duration-300">
              Độ chính xác gợi ý
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator - Only show when in hero section */}
        {showScrollIndicator && (
          <div
            className={cn("hero-scroll-indicator transition-all duration-500", {
              "translate-y-0 opacity-100": isVisible,
              "translate-y-10 opacity-0": !isVisible,
            })}
            onClick={handleScrollToNext}
          >
            <div className="flex flex-col items-center text-white/70 hover:text-white transition-colors cursor-pointer">
              <span className="scroll-text hidden sm:block">
                Cuộn xuống để khám phá
              </span>
              <div className="scroll-mouse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
