"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import "./reviews.scss";

interface Review {
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  year: string;
  rating: number;
  title: string;
  content: string;
  tags: string[];
  verified: boolean;
  helpful: number;
}

const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Nguyễn Minh Anh",
    avatar: "👩‍🎓",
    university: "Đại học Bách Khoa Hà Nội",
    major: "Công nghệ Thông tin",
    year: "K65",
    rating: 5,
    title: "Trường tuyệt vời cho ngành IT",
    content:
      "Chương trình học rất thực tế, giảng viên giỏi và có nhiều cơ hội thực tập tại các công ty lớn. Cơ sở vật chất hiện đại, thư viện đầy đủ tài liệu. Môi trường học tập năng động và cạnh tranh tích cực.",
    tags: ["Chất lượng cao", "Thực tế", "Cơ hội việc làm"],
    verified: true,
    helpful: 124,
  },
  {
    id: "2",
    name: "Trần Văn Hùng",
    avatar: "👨‍🎓",
    university: "Đại học Kinh tế Quốc dân",
    major: "Tài chính - Ngân hàng",
    year: "K64",
    rating: 4,
    title: "Môi trường học tập tốt",
    content:
      "Trường có uy tín trong lĩnh vực kinh tế, giảng viên có kinh nghiệm thực tế. Tuy nhiên, cơ sở vật chất cần được cải thiện thêm. Sinh hoạt câu lạc bộ phong phú.",
    tags: ["Uy tín", "Giảng viên giỏi", "Hoạt động đa dạng"],
    verified: true,
    helpful: 89,
  },
  {
    id: "3",
    name: "Lê Thị Mai",
    avatar: "👩‍⚕️",
    university: "Đại học Y Hà Nội",
    major: "Bác sĩ Đa khoa",
    year: "K63",
    rating: 5,
    title: "Chất lượng đào tạo xuất sắc",
    content:
      "Chương trình đào tạo bài bản, thực hành nhiều tại bệnh viện. Giảng viên đều là các bác sĩ có kinh nghiệm. Áp lực học tập cao nhưng rất đáng giá cho tương lai.",
    tags: ["Chất lượng cao", "Thực hành nhiều", "Tương lai tốt"],
    verified: true,
    helpful: 156,
  },
  {
    id: "4",
    name: "Phạm Đức Nam",
    avatar: "👨‍💼",
    university: "Đại học Ngoại thương",
    major: "Quản trị Kinh doanh",
    year: "K66",
    rating: 4,
    title: "Cơ hội networking tuyệt vời",
    content:
      "Trường có mạng lưới cựu sinh viên rộng khắp, nhiều cơ hội gặp gỡ doanh nhân thành đạt. Chương trình học cập nhật theo xu hướng thị trường. Campus đẹp và hiện đại.",
    tags: ["Networking", "Cập nhật", "Campus đẹp"],
    verified: true,
    helpful: 92,
  },
  {
    id: "5",
    name: "Hoàng Thị Lan",
    avatar: "👩‍🏫",
    university: "Đại học Sư phạm Hà Nội",
    major: "Sư phạm Toán",
    year: "K65",
    rating: 4,
    title: "Đào tạo giáo viên chuyên nghiệp",
    content:
      "Chương trình sư phạm rất bài bản, có nhiều môn thực hành giảng dạy. Giảng viên tận tâm, hỗ trợ sinh viên rất tốt. Học phí hợp lý, phù hợp với gia đình có thu nhập trung bình.",
    tags: ["Thực hành", "Tận tâm", "Học phí hợp lý"],
    verified: true,
    helpful: 78,
  },
  {
    id: "6",
    name: "Vũ Minh Tuấn",
    avatar: "👨‍🔬",
    university: "Đại học Khoa học Tự nhiên",
    major: "Hóa học",
    year: "K64",
    rating: 5,
    title: "Nghiên cứu khoa học mạnh",
    content:
      "Trường có nhiều phòng thí nghiệm hiện đại, cơ hội tham gia nghiên cứu khoa học từ sớm. Giảng viên đều có trình độ cao, nhiều tiến sĩ từ nước ngoài về.",
    tags: ["Nghiên cứu", "Trang thiết bị tốt", "Giảng viên giỏi"],
    verified: true,
    helpful: 103,
  },
];

const STATS = [
  { number: "15,000+", label: "Đánh giá được xác thực", icon: "✅" },
  { number: "500+", label: "Trường đại học", icon: "🏫" },
  { number: "4.8/5", label: "Điểm trung bình", icon: "⭐" },
  { number: "95%", label: "Sinh viên hài lòng", icon: "😊" },
];

export function Reviews() {
  const [visibleReviews, setVisibleReviews] = useState<Set<string>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(REVIEWS.length / 3));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reviewId = entry.target.getAttribute("data-review-id");
            if (reviewId) {
              setVisibleReviews((prev) => new Set([...prev, reviewId]));
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const reviewElements = document.querySelectorAll("[data-review-id]");
    reviewElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  return (
    <section
      ref={sectionRef}
      className="reviews-section py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-300 rounded-full text-sm font-medium mb-4">
            <span className="mr-2">💬</span>
            Đánh giá từ sinh viên
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nghe từ{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              sinh viên thật
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Hàng nghìn đánh giá chân thực từ sinh viên đang học và đã tốt nghiệp
            tại các trường đại học trên toàn quốc
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews Carousel */}
        <div className="reviews-carousel relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(REVIEWS.length / 3) }).map(
                (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                      {REVIEWS.slice(slideIndex * 3, slideIndex * 3 + 3).map(
                        (review, index) => (
                          <ReviewCard
                            key={review.id}
                            review={review}
                            index={index}
                            isVisible={visibleReviews.has(review.id)}
                          />
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(REVIEWS.length / 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={cn(
                    "h-3 rounded-full transition-all duration-300 border border-white/30",
                    {
                      "bg-orange-500 w-8 border-orange-500":
                        currentSlide === index,
                      "bg-white/20 w-3 hover:bg-white/30":
                        currentSlide !== index,
                    }
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              )
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-sm rounded-2xl p-8 text-white border border-orange-500/30 relative overflow-hidden">
            {/* CTA Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Bạn cũng muốn chia sẻ trải nghiệm?
              </h3>
              <p className="text-lg mb-6 text-orange-100">
                Hãy để lại đánh giá về trường của bạn để giúp các bạn khác
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-300 hover:scale-105 transform shadow-lg">
                  Viết đánh giá
                </button>
                <button className="border-2 border-white/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-all duration-300 hover:scale-105 transform backdrop-blur-sm">
                  Xem tất cả đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  index,
  isVisible,
}: {
  review: Review;
  index: number;
  isVisible: boolean;
}) {
  const [isHelpful, setIsHelpful] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={cn(
          "text-lg",
          i < rating ? "text-yellow-400" : "text-gray-400"
        )}
      >
        ⭐
      </span>
    ));
  };

  const handleHelpful = () => {
    setIsHelpful(!isHelpful);
  };

  const handleViewDetail = () => {
    // Navigate to review detail page
    window.location.href = `/reviews/${review.id}`;
  };

  return (
    <div
      data-review-id={review.id}
      className={cn(
        "review-card bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 h-full border border-white/20 hover:border-white/40 hover:bg-white/98",
        {
          "review-card--visible": isVisible,
        }
      )}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
            {review.avatar}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
              {review.verified && (
                <span
                  className="text-blue-500 text-sm bg-blue-100 px-2 py-0.5 rounded-full"
                  title="Đã xác thực"
                >
                  ✓
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 font-medium">
              {review.university}
            </p>
            <p className="text-sm text-gray-600">
              {review.major} • {review.year}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 flex-1 flex flex-col min-h-0">
        <h5 className="font-semibold text-gray-900 mb-2 flex-shrink-0">
          {review.title}
        </h5>
        <div className="flex-1 flex flex-col min-h-0">
          <p className="text-gray-700 leading-relaxed line-clamp-3 overflow-hidden flex-1">
            {review.content}
          </p>
          <button
            onClick={handleViewDetail}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-3 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded flex-shrink-0 w-fit flex items-center gap-1"
          >
            Xem chi tiết
            <svg
              className="w-4 h-4"
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
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {review.tags.map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className="px-3 py-1 bg-gradient-to-r from-blue-100 to-orange-100 text-gray-800 text-xs rounded-full font-medium border border-blue-200/50"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleHelpful}
          className={cn(
            "flex items-center space-x-2 text-sm transition-all duration-200 px-3 py-1 rounded-lg",
            {
              "text-blue-600 bg-blue-50 border border-blue-200": isHelpful,
              "text-gray-600 hover:text-gray-800 hover:bg-gray-50": !isHelpful,
            }
          )}
        >
          <span
            className={cn("transition-transform duration-200", {
              "scale-110": isHelpful,
            })}
          >
            👍
          </span>
          <span>Hữu ích ({review.helpful + (isHelpful ? 1 : 0)})</span>
        </button>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          2 tuần trước
        </span>
      </div>
    </div>
  );
}
