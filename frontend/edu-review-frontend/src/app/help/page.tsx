"use client";

import { Navbar } from '@/features/landing/components/navbar/Navbar';
import { Footer } from '@/features/landing/components/footer/Footer';
import React, { useState, useEffect } from 'react';
import { HelpCircle, GraduationCap, Users, Building, Search, Star, MessageSquare, BookOpen, Settings, Shield, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const sections = [
  {
    id: 'getting-started',
    title: 'Bắt đầu sử dụng',
    icon: HelpCircle,
    color: 'from-blue-500 to-cyan-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Chào mừng bạn đến với nền tảng Review & Gợi ý Đại học! Dưới đây là hướng dẫn cơ bản để bắt đầu sử dụng dịch vụ của chúng tôi.</p>
        <div className="grid md:grid-cols-1 gap-4">
          <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Bước 1: Đăng ký tài khoản</h3>
              <p className="text-white/80">Tạo tài khoản miễn phí bằng email hoặc đăng nhập qua Google/Facebook để bắt đầu sử dụng tất cả tính năng.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">Bước 2: Khám phá trường đại học</h3>
              <p className="text-white/80">Tìm kiếm và xem thông tin chi tiết về các trường đại học, bao gồm đánh giá, xếp hạng và thông tin tuyển sinh.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Bước 3: Đánh giá và chia sẻ</h3>
              <p className="text-white/80">Đánh giá trường đại học dựa trên trải nghiệm thực tế và chia sẻ kinh nghiệm với cộng đồng.</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'features-guide',
    title: 'Hướng dẫn tính năng',
    icon: Settings,
    color: 'from-green-500 to-emerald-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Khám phá các tính năng chính của nền tảng và cách sử dụng chúng hiệu quả:</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-blue-400">Tìm kiếm & Khám phá</h3>
            </div>
            <ul className="space-y-2 text-white/80">
              <li>• Tìm trường theo tên, địa điểm, ngành học</li>
              <li>• Lọc theo tiêu chí: học phí, xếp hạng, đánh giá</li>
              <li>• So sánh các trường đại học</li>
              <li>• Xem bản đồ vị trí trường</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-400">Gợi ý trường đại học</h3>
            </div>
            <ul className="space-y-2 text-white/80">
              <li>• Làm bài test tính cách</li>
              <li>• Nhập thông tin học tập</li>
              <li>• Chọn sở thích và mục tiêu</li>
              <li>• Nhận gợi ý trường phù hợp</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-purple-400">Đánh giá & Review</h3>
            </div>
            <ul className="space-y-2 text-white/80">
              <li>• Đánh giá trường theo nhiều tiêu chí</li>
              <li>• Chia sẻ trải nghiệm học tập</li>
              <li>• Đăng ảnh và video</li>
              <li>• Tương tác với đánh giá khác</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-orange-400">Cộng đồng & Blog</h3>
            </div>
            <ul className="space-y-2 text-white/80">
              <li>• Tham gia thảo luận</li>
              <li>• Đọc bài viết hữu ích</li>
              <li>• Hỏi đáp với chuyên gia</li>
              <li>• Chia sẻ kinh nghiệm</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'user-guides',
    title: 'Hướng dẫn theo đối tượng',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Hướng dẫn chi tiết cho từng đối tượng người dùng:</p>
        <div className="grid md:grid-cols-1 gap-6">
          <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-blue-400">Học sinh & Sinh viên</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">Tìm trường phù hợp:</h4>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Sử dụng tính năng gợi ý trường</li>
                  <li>• Đọc đánh giá từ sinh viên</li>
                  <li>• So sánh các trường</li>
                  <li>• Xem thông tin tuyển sinh</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">Chia sẻ trải nghiệm:</h4>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Đánh giá trường đã học</li>
                  <li>• Chia sẻ kinh nghiệm học tập</li>
                  <li>• Tham gia cộng đồng</li>
                  <li>• Hỏi đáp với chuyên gia</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-400">Phụ huynh</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Hỗ trợ con em:</h4>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Tìm hiểu về các trường đại học</li>
                  <li>• Xem đánh giá và xếp hạng</li>
                  <li>• So sánh học phí và chất lượng</li>
                  <li>• Tham khảo kinh nghiệm phụ huynh khác</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Tư vấn chuyên môn:</h4>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Liên hệ tư vấn viên</li>
                  <li>• Tham gia hội thảo trực tuyến</li>
                  <li>• Đọc bài viết chuyên môn</li>
                  <li>• Tham gia cộng đồng phụ huynh</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-purple-400">Trường Đại học</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Quản lý trang trường:</h4>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Cập nhật thông tin chính thức</li>
                  <li>• Quản lý đánh giá và phản hồi</li>
                  <li>• Xem thống kê truy cập</li>
                  <li>• Tương tác với sinh viên</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Marketing & PR:</h4>
                <ul className="space-y-1 text-white/80 text-sm">
                  <li>• Đăng tin tuyển sinh</li>
                  <li>• Chia sẻ tin tức trường</li>
                  <li>• Tổ chức sự kiện trực tuyến</li>
                  <li>• Quảng cáo có mục tiêu</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'faq',
    title: 'Câu hỏi thường gặp',
    icon: HelpCircle,
    color: 'from-orange-500 to-red-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Giải đáp các câu hỏi thường gặp về nền tảng:</p>
        <div className="space-y-6">
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 text-orange-400 mr-2" />
              Làm thế nào để đánh giá trường đại học?
            </h4>
            <p className="text-white/80 ml-7">Bạn cần đăng ký tài khoản và có thể đánh giá trường dựa trên trải nghiệm thực tế. Chúng tôi khuyến khích đánh giá khách quan và có cơ sở. Đánh giá sẽ được kiểm duyệt trước khi hiển thị.</p>
          </div>
          
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 text-orange-400 mr-2" />
              Tính năng gợi ý trường hoạt động như thế nào?
            </h4>
            <p className="text-white/80 ml-7">Hệ thống sẽ phân tích tính cách, sở thích, kết quả học tập và nhu cầu của bạn để đưa ra gợi ý trường phù hợp nhất. Thuật toán AI của chúng tôi học hỏi từ hàng nghìn đánh giá và trải nghiệm thực tế.</p>
          </div>
          
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 text-orange-400 mr-2" />
              Trường đại học có thể hợp tác như thế nào?
            </h4>
            <p className="text-white/80 ml-7">Trường đại học có thể đăng ký tài khoản quản trị để cập nhật thông tin, quản lý đánh giá và tương tác với sinh viên. Chúng tôi cung cấp các gói hợp tác khác nhau tùy theo nhu cầu.</p>
          </div>
          
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 text-orange-400 mr-2" />
              Làm sao để báo cáo nội dung vi phạm?
            </h4>
            <p className="text-white/80 ml-7">Bạn có thể báo cáo nội dung vi phạm bằng cách nhấn vào nút "Báo cáo" bên cạnh nội dung đó. Đội ngũ kiểm duyệt sẽ xem xét và xử lý trong vòng 24-48 giờ.</p>
          </div>
          
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 text-orange-400 mr-2" />
              Có thể xóa hoặc chỉnh sửa đánh giá không?
            </h4>
            <p className="text-white/80 ml-7">Bạn có thể chỉnh sửa đánh giá của mình trong vòng 30 ngày sau khi đăng. Sau đó, bạn cần liên hệ hỗ trợ để yêu cầu chỉnh sửa hoặc xóa.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'troubleshooting',
    title: 'Khắc phục sự cố',
    icon: AlertCircle,
    color: 'from-red-500 to-pink-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Hướng dẫn khắc phục các sự cố thường gặp:</p>
        <div className="space-y-4">
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              <strong>Không thể đăng nhập:</strong> Kiểm tra email và mật khẩu. Nếu quên mật khẩu, sử dụng tính năng "Quên mật khẩu" để đặt lại.
            </AlertDescription>
          </Alert>
          
          <Alert className="bg-orange-500/10 border-orange-500/20">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-400">
              <strong>Đánh giá không hiển thị:</strong> Đánh giá cần được kiểm duyệt trước khi hiển thị. Thời gian kiểm duyệt thường từ 1-2 ngày làm việc.
            </AlertDescription>
          </Alert>
          
          <Alert className="bg-yellow-500/10 border-yellow-500/20">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-400">
              <strong>Trang web chậm:</strong> Thử làm mới trang hoặc xóa cache trình duyệt. Nếu vấn đề tiếp tục, liên hệ hỗ trợ kỹ thuật.
            </AlertDescription>
          </Alert>
          
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-400">
              <strong>Tính năng không hoạt động:</strong> Đảm bảo bạn đã đăng nhập và có quyền truy cập tính năng đó. Kiểm tra thông báo lỗi để biết thêm chi tiết.
            </AlertDescription>
          </Alert>
        </div>
      </>
    ),
  },

];

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    // Intersection Observer for tracking active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar />
      
      <section className="relative pt-24 pb-16 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <HelpCircle className="w-6 h-6 text-blue-400" />
              <span className="text-white/80 font-medium">Hỗ trợ & Hướng dẫn</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Trung tâm hỗ trợ
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Hướng dẫn chi tiết và hỗ trợ sử dụng nền tảng Review & Gợi ý Đại học
            </p>
          </div>

          {/* Navigation */}
          <div className="sticky top-24 z-40 mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex flex-wrap justify-center gap-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium hidden md:inline">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-24">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <section 
                  key={section.id} 
                  id={section.id} 
                  className="scroll-mt-32 pt-8"
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 hover:bg-white/10 transition-all duration-500">
                    <div className="flex items-start space-x-6 mb-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-2">#{(index + 1).toString().padStart(2, '0')}</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                    <div className="text-white/90 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>


        </div>
      </section>

      <Footer />
    </div>
  );
} 