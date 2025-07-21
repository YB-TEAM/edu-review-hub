"use client";

import { Navbar } from '@/features/landing/components/navbar/Navbar';
import { Footer } from '@/features/landing/components/footer/Footer';
import React, { useState, useEffect } from 'react';
import { FileText, Shield, Users, GraduationCap, Building, AlertTriangle, CheckCircle, Scale, Gavel, Eye, Lock, UserCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const sections = [
  {
    id: 'general',
    title: 'Điều khoản chung',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Khi sử dụng nền tảng "Review & Gợi ý Đại học", bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây. Việc sử dụng dịch vụ của chúng tôi có nghĩa là bạn đã đọc, hiểu và chấp nhận toàn bộ nội dung này.</p>
        <div className="grid md:grid-cols-1 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
            <p>Bạn phải từ 13 tuổi trở lên để sử dụng dịch vụ này.</p>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
            <p>Bạn chịu trách nhiệm về tính chính xác và cập nhật của thông tin cá nhân.</p>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
            <p>Không được sử dụng dịch vụ cho mục đích bất hợp pháp hoặc gây hại cho người khác.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'user-rights',
    title: 'Quyền và nghĩa vụ của người dùng',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Người dùng có các quyền và nghĩa vụ sau khi sử dụng nền tảng:</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-400">Quyền của người dùng</h3>
            </div>
            <ul className="space-y-2 text-white/80">
              <li>• Đăng ký và sử dụng tài khoản miễn phí</li>
              <li>• Đánh giá và chia sẻ trải nghiệm về trường đại học</li>
              <li>• Sử dụng tính năng gợi ý trường đại học</li>
              <li>• Tham gia cộng đồng và blog</li>
              <li>• Yêu cầu hỗ trợ và tư vấn</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-orange-400">Nghĩa vụ của người dùng</h3>
            </div>
            <ul className="space-y-2 text-white/80">
              <li>• Cung cấp thông tin chính xác</li>
              <li>• Đánh giá khách quan và có cơ sở</li>
              <li>• Tôn trọng quyền riêng tư của người khác</li>
              <li>• Không vi phạm bản quyền</li>
              <li>• Báo cáo nội dung vi phạm</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'content-policy',
    title: 'Chính sách nội dung',
    icon: Eye,
    color: 'from-purple-500 to-pink-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Chúng tôi cam kết duy trì môi trường lành mạnh và hữu ích cho cộng đồng giáo dục:</p>
        <div className="grid md:grid-cols-1 gap-4">
          <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <h3 className="font-semibold text-purple-400 mb-3">Nội dung được phép</h3>
            <ul className="space-y-2 text-white/80">
              <li>• Đánh giá khách quan dựa trên trải nghiệm thực tế</li>
              <li>• Chia sẻ kinh nghiệm học tập và sinh hoạt</li>
              <li>• Thảo luận về chương trình đào tạo và cơ sở vật chất</li>
              <li>• Hỏi đáp về quy trình tuyển sinh và học phí</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl border border-red-500/20">
            <h3 className="font-semibold text-red-400 mb-3">Nội dung bị cấm</h3>
            <ul className="space-y-2 text-white/80">
              <li>• Nội dung xúc phạm, kỳ thị hoặc quấy rối</li>
              <li>• Thông tin sai lệch hoặc không có cơ sở</li>
              <li>• Quảng cáo thương mại không được phép</li>
              <li>• Nội dung vi phạm bản quyền</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'university-rights',
    title: 'Quyền và trách nhiệm của trường đại học',
    icon: Building,
    color: 'from-indigo-500 to-purple-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Các trường đại học có quyền và trách nhiệm đặc biệt khi tham gia nền tảng:</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
            <h3 className="font-semibold text-indigo-400 mb-3">Quyền của trường đại học</h3>
            <ul className="space-y-2 text-white/80">
              <li>• Quản lý trang thông tin trường</li>
              <li>• Cập nhật thông tin chính thức</li>
              <li>• Phản hồi đánh giá của sinh viên</li>
              <li>• Truy cập dữ liệu thống kê</li>
              <li>• Yêu cầu kiểm duyệt nội dung</li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <h3 className="font-semibold text-blue-400 mb-3">Trách nhiệm của trường đại học</h3>
            <ul className="space-y-2 text-white/80">
              <li>• Cung cấp thông tin chính xác và cập nhật</li>
              <li>• Tôn trọng quyền đánh giá của sinh viên</li>
              <li>• Không can thiệp vào đánh giá khách quan</li>
              <li>• Tuân thủ quy định về quảng cáo</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'privacy-security',
    title: 'Bảo mật và quyền riêng tư',
    icon: Lock,
    color: 'from-teal-500 to-blue-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Chúng tôi cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng:</p>
        <div className="grid md:grid-cols-1 gap-4">
          <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl border border-teal-500/20">
            <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="font-semibold text-teal-400 mb-2">Bảo vệ dữ liệu</h3>
              <p className="text-white/80">Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin cá nhân của bạn, bao gồm mã hóa dữ liệu, xác thực đa lớp và giám sát bảo mật 24/7.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Quyền riêng tư</h3>
              <p className="text-white/80">Bạn có quyền kiểm soát thông tin cá nhân của mình, bao gồm quyền truy cập, chỉnh sửa, xóa và hạn chế xử lý dữ liệu theo quy định của GDPR và các luật bảo vệ dữ liệu khác.</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'disclaimer',
    title: 'Tuyên bố miễn trừ trách nhiệm',
    icon: Gavel,
    color: 'from-orange-500 to-red-500',
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed">Chúng tôi đưa ra các tuyên bố miễn trừ trách nhiệm quan trọng:</p>
        <div className="space-y-4">
          <Alert className="bg-orange-500/10 border-orange-500/20">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-400">
              <strong>Đánh giá và gợi ý:</strong> Các đánh giá trên nền tảng là ý kiến cá nhân và không phải là lời khuyên chuyên môn. Gợi ý trường đại học chỉ mang tính tham khảo.
            </AlertDescription>
          </Alert>
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <Scale className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-400">
              <strong>Thông tin trường:</strong> Chúng tôi cố gắng cung cấp thông tin chính xác nhưng không đảm bảo tính đầy đủ hoặc cập nhật. Vui lòng kiểm tra trực tiếp với trường đại học.
            </AlertDescription>
          </Alert>
          <Alert className="bg-purple-500/10 border-purple-500/20">
            <Shield className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-purple-400">
              <strong>Bảo mật:</strong> Mặc dù chúng tôi áp dụng các biện pháp bảo mật mạnh mẽ, không có hệ thống nào hoàn toàn an toàn. Chúng tôi không chịu trách nhiệm về các sự cố bảo mật ngoài tầm kiểm soát.
            </AlertDescription>
          </Alert>
        </div>
      </>
    ),
  },

];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('general');
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
              <FileText className="w-6 h-6 text-blue-400" />
              <span className="text-white/80 font-medium">Điều khoản & Quy định</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Điều khoản sử dụng
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Các điều khoản và điều kiện sử dụng nền tảng Review & Gợi ý Đại học
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