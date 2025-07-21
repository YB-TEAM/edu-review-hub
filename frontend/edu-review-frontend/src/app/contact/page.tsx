"use client";

import { Navbar } from '@/features/landing/components/navbar/Navbar';
import { Footer } from '@/features/landing/components/footer/Footer';
import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Users, Building, GraduationCap, UserCheck, Shield, Send, CheckCircle, AlertCircle, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const contactOptions = [
  {
    id: 'students',
    title: 'Học sinh & Sinh viên',
    description: 'Bạn cần hỗ trợ về việc tìm trường, đánh giá, hoặc sử dụng các tính năng gợi ý trường đại học? Chúng tôi luôn sẵn sàng hỗ trợ.',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500',
    action: 'Hỗ trợ học sinh',
    href: '#students-form'
  },
  {
    id: 'parents',
    title: 'Phụ huynh',
    description: 'Bạn muốn tìm hiểu thêm về các trường đại học để hỗ trợ con em mình? Chúng tôi có thể tư vấn chi tiết.',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    action: 'Tư vấn phụ huynh',
    href: '#parents-form'
  },
  {
    id: 'universities',
    title: 'Trường Đại học',
    description: 'Bạn là đại diện trường đại học muốn hợp tác, cập nhật thông tin hoặc quản lý trang trường? Liên hệ ngay.',
    icon: Building,
    color: 'from-purple-500 to-pink-500',
    action: 'Hợp tác trường',
    href: '#universities-form'
  }
];

const contactInfo = [
  {
    title: 'Hỗ trợ chung',
    value: 'support@edu-review-hub.com',
    icon: MessageSquare,
    color: 'text-blue-400',
    href: 'mailto:support@edu-review-hub.com'
  },
  {
    title: 'Hợp tác trường đại học',
    value: 'partnership@edu-review-hub.com',
    icon: Building,
    color: 'text-green-400',
    href: 'mailto:partnership@edu-review-hub.com'
  },
  {
    title: 'Tư vấn học sinh',
    value: 'counseling@edu-review-hub.com',
    icon: GraduationCap,
    color: 'text-purple-400',
    href: 'mailto:counseling@edu-review-hub.com'
  },
  {
    title: 'Hotline tư vấn',
    value: '+84 123 456 789',
    icon: Phone,
    color: 'text-orange-400',
    href: 'tel:+84123456789'
  }
];

const officeInfo = [
  {
    title: 'Trụ sở chính',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    hours: 'Thứ 2 - Thứ 6: 8:00 - 18:00',
    description: 'Hỗ trợ tư vấn học sinh, sinh viên và phụ huynh',
    icon: MapPin,
    color: 'text-blue-400'
  },
  {
    title: 'Văn phòng Hà Nội',
    address: '456 Đường XYZ, Quận Ba Đình, Hà Nội',
    hours: 'Thứ 2 - Thứ 6: 8:00 - 18:00',
    description: 'Hợp tác với các trường đại học miền Bắc',
    icon: MapPin,
    color: 'text-green-400'
  }
];

const services = [
  {
    title: 'Tư vấn chọn trường',
    description: 'Hỗ trợ học sinh tìm trường phù hợp dựa trên tính cách, sở thích và kết quả học tập',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Đánh giá trường đại học',
    description: 'Hướng dẫn cách đánh giá, chia sẻ trải nghiệm và nhận xét về trường đại học',
    icon: UserCheck,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Hợp tác trường đại học',
    description: 'Hỗ trợ trường đại học cập nhật thông tin, quản lý trang trường và tương tác với sinh viên',
    icon: Building,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Cộng đồng & Blog',
    description: 'Tham gia cộng đồng trao đổi, chia sẻ kinh nghiệm và đọc các bài viết hữu ích',
    icon: Users,
    color: 'from-orange-500 to-red-500'
  }
];

export default function ContactPage() {
  const [activeForm, setActiveForm] = useState('students');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    school: '',
    message: '',
    type: 'students'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', role: 'student', school: '', message: '', type: activeForm });
      
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              <span className="text-white/80 font-medium">Liên hệ & Hỗ trợ</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Nền tảng Review & Gợi ý Đại học - Hỗ trợ học sinh, sinh viên, phụ huynh và trường đại học
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div 
                  key={option.id}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 cursor-pointer"
                  onClick={() => setActiveForm(option.id)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{option.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">{option.description}</p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${option.color} hover:scale-105 transition-transform duration-300`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveForm(option.id);
                    }}
                  >
                    {option.action}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Services Overview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Dịch vụ của chúng tôi</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.title} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{service.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Gửi tin nhắn cho chúng tôi</h2>
              
              {submitStatus === 'success' && (
                <Alert className="mb-6 bg-green-500/10 border-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === 'error' && (
                <Alert className="mb-6 bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    Có lỗi xảy ra. Vui lòng thử lại sau.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Họ tên *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Nhập họ tên của bạn"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Số điện thoại</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="+84 123 456 789"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Vai trò *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="student">Học sinh/Sinh viên</option>
                      <option value="parent">Phụ huynh</option>
                      <option value="university">Đại diện trường đại học</option>
                      <option value="teacher">Giáo viên/Cố vấn</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 font-medium">Trường học/Cơ quan</label>
                  <Input
                    type="text"
                    value={formData.school}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Tên trường học hoặc cơ quan"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2 font-medium">Loại yêu cầu</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="students">Tư vấn chọn trường</option>
                    <option value="parents">Tư vấn phụ huynh</option>
                    <option value="universities">Hợp tác trường đại học</option>
                    <option value="review">Hướng dẫn đánh giá</option>
                    <option value="technical">Hỗ trợ kỹ thuật</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 font-medium">Tin nhắn *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-white/50"
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition-transform duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Gửi tin nhắn</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  {contactInfo.map((info) => {
                    const Icon = info.icon;
                    return (
                      <a
                        key={info.title}
                        href={info.href}
                        className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className={`w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-6 h-6 ${info.color}`} />
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">{info.title}</p>
                          <p className="text-white font-medium">{info.value}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Văn phòng</h3>
                <div className="space-y-4">
                  {officeInfo.map((office) => {
                    const Icon = office.icon;
                    return (
                      <div key={office.title} className="p-4 bg-white/5 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${office.color}`} />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">{office.title}</h4>
                            <p className="text-white/70 text-sm mb-1">{office.address}</p>
                            <p className="text-white/60 text-xs mb-2">{office.description}</p>
                            <div className="flex items-center space-x-2 text-white/60 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{office.hours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Câu hỏi thường gặp</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Làm thế nào để đánh giá trường đại học?</h4>
                  <p className="text-white/70">Bạn cần đăng ký tài khoản và có thể đánh giá trường dựa trên trải nghiệm thực tế. Chúng tôi khuyến khích đánh giá khách quan và có cơ sở.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Tính năng gợi ý trường hoạt động như thế nào?</h4>
                  <p className="text-white/70">Hệ thống sẽ phân tích tính cách, sở thích, kết quả học tập và nhu cầu của bạn để đưa ra gợi ý trường phù hợp nhất.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Trường đại học có thể hợp tác như thế nào?</h4>
                  <p className="text-white/70">Trường đại học có thể đăng ký tài khoản quản trị để cập nhật thông tin, quản lý đánh giá và tương tác với sinh viên.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Thời gian phản hồi là bao lâu?</h4>
                  <p className="text-white/70">Chúng tôi thường phản hồi trong vòng 24 giờ làm việc. Với các vấn đề khẩn cấp, chúng tôi sẽ phản hồi ngay lập tức.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 