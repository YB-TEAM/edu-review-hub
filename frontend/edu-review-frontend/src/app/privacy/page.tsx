"use client";

import { Navbar } from '@/features/landing/components/navbar/Navbar';
import { Footer } from '@/features/landing/components/footer/Footer';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, FileCheck, ChevronRight, Users, Database, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const sections = [
    {
      id: 'commitment',
      title: 'Cam kết bảo vệ dữ liệu & quyền riêng tư',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      content: (
        <>
          <p className="mb-6 text-lg leading-relaxed">Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu của bạn bằng các biện pháp bảo mật hiện đại, tuân thủ các tiêu chuẩn quốc tế và quy định pháp luật hiện hành.</p>
          <div className="grid md:grid-cols-1 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
              <p>Kiểm toán bảo mật định kỳ, giám sát liên tục hệ thống.</p>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
              <p>Chỉ thu thập dữ liệu cần thiết, minh bạch mục đích sử dụng.</p>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
              <p>Không chia sẻ dữ liệu cho bên thứ ba khi chưa có sự đồng ý.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'standards',
      title: 'Tiêu chuẩn & Chứng chỉ tuân thủ',
      icon: FileCheck,
      color: 'from-green-500 to-emerald-500',
      content: (
        <>
          <p className="mb-6 text-lg leading-relaxed">Nền tảng của chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế:</p>
          <div className="grid md:grid-cols-1 gap-4">
            <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-400">SOC 2 Type II</h3>
              </div>
              <p className="text-white/80">Đảm bảo kiểm soát bảo mật, tính sẵn sàng và bảo mật dữ liệu.</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400">ISO/IEC 27001:2022</h3>
              </div>
              <p className="text-white/80">Hệ thống quản lý an ninh thông tin quốc tế.</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">GDPR</h3>
              </div>
              <p className="text-white/80">Tuân thủ Quy định bảo vệ dữ liệu chung của EU.</p>
            </div>
          </div>
          <Alert className="mt-6 bg-white/5 border-white/20">
            <AlertDescription className="text-white/80">
              Chúng tôi thường xuyên kiểm tra, đánh giá và cập nhật các biện pháp bảo mật để đáp ứng các tiêu chuẩn mới nhất.
            </AlertDescription>
          </Alert>
        </>
      ),
    },
    {
      id: 'data-collection',
      title: 'Dữ liệu thu thập & mục đích sử dụng',
      icon: Database,
      color: 'from-orange-500 to-red-500',
      content: (
        <>
          <p className="mb-6 text-lg leading-relaxed">Chúng tôi chỉ thu thập các thông tin cần thiết để cung cấp dịch vụ tốt nhất cho bạn, bao gồm:</p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 text-center">
              <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="font-semibold text-orange-400 mb-2">Thông tin tài khoản</h3>
              <p className="text-sm text-white/70">Email, tên, mật khẩu đã mã hóa</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 text-center">
              <Eye className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-400 mb-2">Thông tin sử dụng</h3>
              <p className="text-sm text-white/70">Lịch sử truy cập, đánh giá, phản hồi</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 text-center">
              <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold text-purple-400 mb-2">Thông tin kỹ thuật</h3>
              <p className="text-sm text-white/70">Thiết bị, trình duyệt, địa chỉ IP</p>
            </div>
          </div>
          <Alert className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
            <AlertDescription className="text-white/90">
              <strong>Mục đích sử dụng dữ liệu:</strong> cung cấp dịch vụ, cải thiện trải nghiệm, bảo mật tài khoản, hỗ trợ khách hàng, và tuân thủ quy định pháp luật.
            </AlertDescription>
          </Alert>
        </>
      ),
    },
    {
      id: 'user-rights',
      title: 'Quyền của người dùng',
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      content: (
        <>
          <div className="grid md:grid-cols-1 gap-4">
            <div className="flex items-start space-x-4 p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-indigo-400" />
              </div>
              <p>Quyền truy cập, chỉnh sửa, cập nhật hoặc xóa thông tin cá nhân.</p>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-indigo-400" />
              </div>
              <p>Quyền yêu cầu cung cấp thông tin về việc xử lý dữ liệu cá nhân.</p>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-indigo-400" />
              </div>
              <p>Quyền phản đối hoặc hạn chế việc xử lý dữ liệu trong một số trường hợp.</p>
            </div>
          </div>
          <Alert className="mt-6 bg-indigo-500/10 border-indigo-500/20">
            <AlertDescription className="text-white/90">
              Bạn có thể thực hiện các quyền này thông qua trang cá nhân hoặc liên hệ với chúng tôi.
            </AlertDescription>
          </Alert>
        </>
      ),
    },
    {
      id: 'security-measures',
      title: 'Biện pháp bảo mật',
      icon: Lock,
      color: 'from-red-500 to-pink-500',
      content: (
        <>
          <div className="grid md:grid-cols-1 gap-4">
            <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl border border-red-500/20">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-400 mb-2">Mã hóa dữ liệu</h3>
                <p className="text-white/80">Mã hóa dữ liệu khi lưu trữ và truyền tải.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">Xác thực đa lớp</h3>
                <p className="text-white/80">Xác thực đa lớp (MFA) cho tài khoản quan trọng.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-400 mb-2">Giám sát 24/7</h3>
                <p className="text-white/80">Giám sát, phát hiện và phản ứng với sự cố bảo mật 24/7.</p>
              </div>
            </div>
          </div>
        </>
      ),
    },

  ];
  
  export default function PrivacyPage() {
    const [activeSection, setActiveSection] = useState('commitment');
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
        
        <section className="flex-1 py-16 px-4 relative pt-34">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
  
          <div className="max-w-7xl mx-auto relative">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 mb-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-white/80 font-medium">Bảo mật & Quyền riêng tư</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Chính sách bảo mật
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Cam kết bảo vệ dữ liệu và quyền riêng tư của bạn với các tiêu chuẩn bảo mật quốc tế hàng đầu
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