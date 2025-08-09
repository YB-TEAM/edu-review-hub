"use client";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfileMutation, useGetCurrentUserQuery } from "@/lib/services";
import type { UserProfile } from "@/types/profile";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { CheckCircle, XCircle, Loader2, Camera, Upload, User, UserCircle, Calendar as CalendarIconLucide, BadgeCheck, GraduationCap, School, MapPin, Landmark, Mail } from "lucide-react";
import { Navbar } from "@/features/landing/components/navbar/Navbar";
import { Footer } from "@/features/landing/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarIcon2 } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React from "react";

// Danh sách tỉnh thành Việt Nam
const VIETNAM_PROVINCES = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh",
  "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
  "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
  "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang",
  "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An",
  "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam",
  "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh",
  "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang",
  "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"
];

export default function ProfilePage() {
  const { user: profile, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { refetch: refetchUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    displayName: profile?.displayName || "",
    avatarUrl: profile?.avatarUrl || "",
    coverImageUrl: profile?.coverImageUrl || "",
    bio: profile?.bio || "",
    dateOfBirth: profile?.dateOfBirth || "",
    gender: profile?.gender || "",
    city: profile?.city || "",
    address: profile?.address || "",
    universityName: profile?.universityName || "",
    major: profile?.major || "",
    graduationYear: profile?.graduationYear || "",
    studentId: profile?.studentId || "",
  });
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Bảo vệ route - redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem hồ sơ.");
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Hàm chuyển đổi gender từ backend sang frontend
  const convertGenderFromBackend = (gender: string | null | undefined): string => {
    switch (gender) {
      case "male": return "Nam";
      case "female": return "Nữ";
      case "other": return "Khác";
      case "prefer_not_to_say": return "Không muốn nói";
      default: return "";
    }
  };

  // Hàm chuyển đổi gender từ frontend sang backend
  const convertGenderToBackend = (gender: string): string => {
    switch (gender) {
      case "Nam": return "male";
      case "Nữ": return "female";
      case "Khác": return "other";
      case "Không muốn nói": return "prefer_not_to_say";
      default: return "";
    }
  };

  // Cập nhật form khi profile thay đổi
  React.useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        displayName: profile.displayName || "",
        avatarUrl: profile.avatarUrl || "",
        coverImageUrl: profile.coverImageUrl || "",
        bio: profile.bio || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: convertGenderFromBackend(profile.gender),
        city: profile.city || "",
        address: profile.address || "",
        universityName: profile.universityName || "",
        major: profile.major || "",
        graduationYear: profile.graduationYear || "",
        studentId: profile.studentId || "",
      });
    }
  }, [profile]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
          <Card className="text-center p-8 max-w-md">
            <CardContent className="pt-6">
              <Loader2 className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-bold mb-2">Đang tải...</h2>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect nếu chưa đăng nhập
  if (!isAuthenticated) {
    return null; // Sẽ redirect trong useEffect
  }

  // Không có profile data
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
          <Card className="text-center p-8 max-w-md">
            <CardContent className="pt-6">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">
                Không tìm thấy thông tin hồ sơ.
              </h2>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    // TODO: Implement notification settings

  };

  const handleImageUpload = (type: 'avatar' | 'cover') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (type === 'avatar') {
            setForm({ ...form, avatarUrl: result });
          } else {
            setForm({ ...form, coverImageUrl: result });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccess("");

    try {
      const updateData = {
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        displayName: form.displayName || undefined,
        avatarUrl: form.avatarUrl || undefined,
        coverImageUrl: form.coverImageUrl || undefined,
        bio: form.bio || undefined,
        dateOfBirth: form.dateOfBirth && form.dateOfBirth !== '' ? form.dateOfBirth : undefined,
        gender: form.gender ? convertGenderToBackend(form.gender) : undefined,
        city: form.city || undefined,
        address: form.address || undefined,
        universityName: form.universityName || undefined,
        major: form.major || undefined,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        studentId: form.studentId || undefined,
      };
      
      // Remove undefined and empty values to avoid validation issues
      Object.keys(updateData).forEach(key => {
        const value = (updateData as any)[key];
        if (value === undefined || value === '' || value === null) {
          delete (updateData as any)[key];
        }
      });
      console.log("Sending update data:", updateData);
      await updateProfile(updateData).unwrap();
      // Refetch user data to update UI
      await refetchUser();
      setSuccess("Cập nhật hồ sơ thành công!");
      setEdit(false);
    } catch (error: any) {
      console.error("Update failed:", error);
      if (error?.data?.message) {
        setSuccess(`Có lỗi xảy ra: ${error.data.message}`);
      } else {
        setSuccess("Có lỗi xảy ra khi cập nhật hồ sơ.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản?")) return;
    setActionLoading(true);
    // TODO: Implement deactivate account
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.")) return;
    setActionLoading(true);
    // TODO: Implement delete account
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-700 via-purple-700 to-orange-400 dark:from-blue-950 dark:via-purple-950 dark:to-orange-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-8 px-4 pt-20">
        <div className="w-full max-w-4xl mx-auto relative">
          {success && (
            <Alert className="mb-4 bg-gradient-to-r from-green-400/20 to-blue-400/20 border-0 shadow-lg">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-100">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Avatar overlap lên cả cover và card */}
          <div className="absolute left-1/2 -translate-x-1/2 z-30" style={{ top: 'calc(120px)' }}>
            <div className="relative">
              <img
                src={profile.avatarUrl || "/default-avatar.png"}
                alt="Avatar"
                className="w-40 h-40 rounded-full border-4 border-white shadow-2xl object-cover bg-white/30"
                style={{ boxShadow: '0 4px 32px 0 rgba(80,80,180,0.25)' }}
              />
              {edit && (
                <div 
                  className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => handleImageUpload('avatar')}
                >
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Card className="overflow-hidden rounded-3xl p-0 border-0 mt-8 bg-white/10 dark:bg-slate-900/60 shadow-2xl backdrop-blur-xl">
            {/* Cover Image Section */}
            <div className="relative h-44 md:h-56 w-full rounded-t-3xl overflow-hidden bg-gradient-to-r from-blue-400/40 to-purple-400/40 dark:from-blue-900/40 dark:to-purple-900/40 p-0 m-0">
              {profile.coverImageUrl && (
                <img 
                  src={profile.coverImageUrl} 
                  alt="Cover" 
                  className="w-full h-full object-cover rounded-t-3xl"
                  style={{ display: "block" }}
                />
              )}
              {edit && (
                <div 
                  className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => handleImageUpload('cover')}
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            <CardContent className="pt-10 pb-10 px-6 md:px-12">
              {/* Profile Header hiện đại */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg leading-tight tracking-normal">
                    {profile.displayName || <span className="text-blue-200 flex items-center gap-1"><span className="inline-block align-middle"><svg width='18' height='18' fill='none' viewBox='0 0 24 24'><path stroke='#60a5fa' strokeWidth='2' d='M12 17v.01M12 7v4m0 8a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z'/></svg></span>Chưa cập nhật</span>}
                  </h1>
                  {profile.isStudentVerified && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 text-green-900 shadow-md px-3 py-1 text-xs font-semibold">
                      Đã xác thực SV
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                  <span className="text-lg text-white font-semibold flex items-center gap-1">
                    <svg width='20' height='20' fill='none' viewBox='0 0 24 24'><path stroke='#a5b4fc' strokeWidth='2' d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z'/></svg>
                    {profile.firstName} {profile.lastName}
                  </span>
                                          <Badge
                          variant="default"
                          className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-2 py-0.5 text-xs font-semibold"
                        >
                          Đang hoạt động
                        </Badge>
                </div>
                {profile.bio && (
                  <p className="text-blue-100 dark:text-blue-200 italic mt-4 max-w-2xl mx-auto text-lg flex items-center gap-2 justify-center">
                    <svg width='20' height='20' fill='none' viewBox='0 0 24 24'><path stroke='#818cf8' strokeWidth='2' d='M7 17h.01M7 7h.01M7 12h.01M12 17h.01M12 7h.01M12 12h.01M17 17h.01M17 7h.01M17 12h.01'/></svg>
                    {profile.bio}
                  </p>
                )}
              </div>

              <Separator className="my-8 bg-white/40 dark:bg-white/30" />

              {edit ? (
                <form onSubmit={handleUpdate} className="space-y-8">
                  {/* Basic Information */}
                  <Card className="bg-white/5 dark:bg-slate-900/40 border-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-blue-200">Thông tin cơ bản</CardTitle>
                      <CardDescription className="text-blue-100">Cập nhật thông tin cá nhân của bạn</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-blue-100">Họ</Label>
                          <Input
                            id="firstName"
                            value={form.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            placeholder="Nhập họ của bạn"
                            className="bg-white/10 border border-blue-400/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 text-white placeholder:text-blue-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-blue-100">Tên</Label>
                          <Input
                            id="lastName"
                            value={form.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            placeholder="Nhập tên của bạn"
                            className="bg-white/10 border border-blue-400/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 text-white placeholder:text-blue-200"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-blue-100">Tên hiển thị</Label>
                        <Input
                          id="displayName"
                          value={form.displayName}
                          onChange={(e) => handleChange("displayName", e.target.value)}
                          placeholder="Nhập tên hiển thị"
                          className="bg-white/10 border border-purple-400/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 text-white placeholder:text-purple-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-blue-100">Tiểu sử</Label>
                        <Textarea
                          id="bio"
                          value={form.bio}
                          onChange={(e) => handleChange("bio", e.target.value)}
                          placeholder="Giới thiệu về bản thân..."
                          rows={3}
                          className="bg-white/10 border border-purple-400/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 text-white placeholder:text-purple-200"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth" className="text-blue-100">Ngày sinh</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                data-empty={!form.dateOfBirth}
                                className={
                                  "bg-white/10 border border-blue-400/40 text-white placeholder:text-blue-200 flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs transition-all outline-none justify-start text-left font-normal" +
                                  (!form.dateOfBirth ? " text-blue-200" : " text-white")
                                }
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-blue-200" />
                                {form.dateOfBirth ? (
                                  <span className="text-white">{format(new Date(form.dateOfBirth), "PPP")}</span>
                                ) : (
                                  <span className="text-blue-200">Chọn ngày sinh</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start" side="bottom" className="w-auto p-0 z-[9999] bg-slate-900/90 border-0">
                              <CalendarIcon2
                                mode="single"
                                selected={form.dateOfBirth ? new Date(form.dateOfBirth) : undefined}
                                onSelect={(date) => handleChange("dateOfBirth", date ? (date as Date).toISOString().slice(0, 10) : "")}
                                initialFocus
                                className="text-white"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender" className="text-blue-100">Giới tính</Label>
                          <Select value={form.gender} onValueChange={(value) => handleChange("gender", value)}>
                            <SelectTrigger className="bg-white/10 border border-blue-400/40 text-white placeholder:text-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40">
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900/90 border-0 text-white max-h-60 overflow-y-auto">
                              <SelectItem value="Nam" className="hover:bg-blue-400/20">Nam</SelectItem>
                              <SelectItem value="Nữ" className="hover:bg-purple-400/20">Nữ</SelectItem>
                              <SelectItem value="Khác" className="hover:bg-orange-400/20">Khác</SelectItem>
                              <SelectItem value="Không muốn nói" className="hover:bg-gray-400/20">Không muốn nói</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Location Information */}
                  <Card className="bg-white/5 dark:bg-slate-900/40 border-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-blue-200">Thông tin địa chỉ</CardTitle>
                      <CardDescription className="text-blue-100">Cập nhật thông tin nơi ở của bạn</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-blue-100">Tỉnh/Thành phố</Label>
                        <Select value={form.city} onValueChange={(value) => handleChange("city", value)}>
                          <SelectTrigger className="bg-white/10 border border-blue-400/40 text-white placeholder:text-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40">
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900/90 border-0 text-white max-h-60 overflow-y-auto">
                            {VIETNAM_PROVINCES.map((province) => (
                              <SelectItem key={province} value={province} className="hover:bg-blue-400/20">
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-blue-100">Địa chỉ chi tiết</Label>
                        <Textarea
                          id="address"
                          value={form.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          placeholder="Nhập địa chỉ chi tiết..."
                          rows={2}
                          className="bg-white/10 border border-blue-400/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 text-white placeholder:text-blue-200"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {/* Education Information */}
                  <Card className="bg-white/5 dark:bg-slate-900/40 border-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-blue-200">Thông tin học vấn</CardTitle>
                      <CardDescription className="text-blue-100">Cập nhật thông tin trường học và chuyên ngành</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="universityName" className="text-blue-100">Trường đại học</Label>
                        <Input
                          id="universityName"
                          value={form.universityName}
                          onChange={(e) => handleChange("universityName", e.target.value)}
                          placeholder="Nhập tên trường đại học"
                          className="bg-white/10 border border-purple-400/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 text-white placeholder:text-purple-200"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="major" className="text-blue-100">Chuyên ngành</Label>
                          <Input
                            id="major"
                            value={form.major}
                            onChange={(e) => handleChange("major", e.target.value)}
                            placeholder="Nhập chuyên ngành"
                            className="bg-white/10 border border-purple-400/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 text-white placeholder:text-purple-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="graduationYear" className="text-blue-100">Năm tốt nghiệp</Label>
                          <Select value={form.graduationYear ? String(form.graduationYear) : ""} onValueChange={(value) => handleChange("graduationYear", value)}>
                            <SelectTrigger className="bg-white/10 border border-purple-400/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 text-white placeholder:text-purple-200">
                              <SelectValue placeholder="Chọn năm tốt nghiệp" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900/90 border-0 text-white max-h-60 overflow-y-auto">
                              {Array.from({length: 2050-2000+1}, (_,i) => (2015+i)).map(year => (
                                <SelectItem key={year.toString()} value={year.toString()} className="hover:bg-purple-400/20">{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studentId" className="text-blue-100">Mã sinh viên</Label>
                        <Input
                          id="studentId"
                          value={form.studentId}
                          onChange={(e) => handleChange("studentId", e.target.value)}
                          placeholder="Nhập mã sinh viên"
                          className="bg-white/10 border border-purple-400/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 text-white placeholder:text-purple-200"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {/* Notification Settings */}
                  <Card className="bg-white/5 dark:bg-slate-900/40 border-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-blue-200">Cài đặt thông báo</CardTitle>
                      <CardDescription className="text-blue-100">Nhận thông báo qua email</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-blue-100">Thông báo Email</Label>
                        </div>
                        <Switch
                          checked={false}
                          onCheckedChange={(value) => handleNotificationChange("email", value)}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 data-[state=unchecked]:bg-white/10 border border-blue-400/40"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEdit(false)}
                      disabled={actionLoading}
                      className="text-blue-100 border-blue-400/40 hover:bg-blue-400/10"
                    >
                      Hủy
                    </Button>
                    <Button type="submit" disabled={actionLoading} className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 text-white font-semibold shadow-lg border-0 hover:brightness-110">
                      {actionLoading && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              ) : (
                // Thông tin cá nhân hiện đại
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cột trái */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-blue-400" />
                        <div>
                          <div className="text-xs text-blue-200">Họ</div>
                          <div className="text-lg text-white font-medium">{profile.firstName || <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <UserCircle className="w-6 h-6 text-cyan-400" />
                        <div>
                          <div className="text-xs text-blue-200">Tên</div>
                          <div className="text-lg text-white font-medium">{profile.lastName || <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarIconLucide className="w-6 h-6 text-yellow-400" />
                        <div>
                          <div className="text-xs text-blue-200">Ngày sinh</div>
                          <div className="text-lg text-white font-medium">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN") : <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BadgeCheck className="w-6 h-6 text-pink-400" />
                        <div>
                          <div className="text-xs text-blue-200">Giới tính</div>
                          <div className="text-lg text-white font-medium">{profile.gender ? convertGenderFromBackend(profile.gender) : <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                    </div>
                    {/* Cột phải */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <School className="w-6 h-6 text-blue-400" />
                        <div>
                          <div className="text-xs text-blue-200">Trường đại học</div>
                          <div className="text-lg text-white font-medium">{profile.universityName || <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-pink-400" />
                        <div>
                          <div className="text-xs text-blue-200">Chuyên ngành</div>
                          <div className="text-lg text-white font-medium">{profile.major || <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarIconLucide className="w-6 h-6 text-yellow-400" />
                        <div>
                          <div className="text-xs text-blue-200">Năm tốt nghiệp</div>
                          <div className="text-lg text-white font-medium">{profile.graduationYear || <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BadgeCheck className="w-6 h-6 text-cyan-400" />
                        <div>
                          <div className="text-xs text-blue-200">Mã sinh viên</div>
                          <div className="text-lg text-white font-medium">{profile.studentId || <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-green-400" />
                        <div>
                          <div className="text-xs text-blue-200">Địa chỉ</div>
                          <div className="text-lg text-white font-medium">{profile.address || <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Landmark className="w-6 h-6 text-orange-400" />
                        <div>
                          <div className="text-xs text-blue-200">Tỉnh/Thành phố</div>
                          <div className="text-lg text-white font-medium">{profile.city || <span className="text-blue-200 flex items-center gap-1"><XCircle className="w-4 h-4 inline-block text-blue-200" />Chưa cập nhật</span>}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator className="my-8 bg-white/30 dark:bg-white/20" />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => setEdit(true)}
                  disabled={actionLoading}
                  className="min-w-[120px] bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 text-white font-semibold shadow-lg border-0 hover:brightness-110"
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDeactivate}
                                      disabled={actionLoading}
                  className="min-w-[120px] bg-white/10 text-blue-100 border border-blue-300 hover:bg-blue-200/20 hover:text-white"
                >
                  {actionLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Vô hiệu hóa
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="min-w-[120px] bg-gradient-to-r from-red-500 to-orange-400 text-white border-0 hover:brightness-110"
                >
                  {actionLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Xóa tài khoản
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}