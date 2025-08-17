"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useGetProfileQuery, 
  useUpdateProfileMutation,
  UserProfile,
  UpdateProfileRequest
} from '@/lib/services/userProfileApi';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  // RTK Query hooks
  const { data: profile, isLoading, error, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});
  const [originalData, setOriginalData] = useState<UserProfile | null>(null);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setOriginalData(profile);
      setFormData({
        displayName: profile.displayName || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || undefined,
        bio: profile.bio || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        studentId: profile.studentId || '',
        major: profile.major || '',
        university: profile.university || '',
        graduationYear: profile.graduationYear || undefined,
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Filter out empty values
      const dataToUpdate = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '' && value !== undefined)
      );

      const updatedProfile = await updateProfile(dataToUpdate).unwrap();
      
      toast.success("Thông tin cá nhân đã được cập nhật");

      // Update AuthContext if displayName changed
      if (updatedProfile.displayName && updatedProfile.displayName !== user?.displayName) {
        updateUser({ ...user, displayName: updatedProfile.displayName });
      }

      setIsEditing(false);
      refetch(); // Refresh the profile data
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể cập nhật thông tin cá nhân");
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData({
        displayName: originalData.displayName || '',
        firstName: originalData.firstName || '',
        lastName: originalData.lastName || '',
        phone: originalData.phone || '',
        dateOfBirth: originalData.dateOfBirth || '',
        gender: originalData.gender || undefined,
        bio: originalData.bio || '',
        address: originalData.address || '',
        city: originalData.city || '',
        country: originalData.country || '',
        studentId: originalData.studentId || '',
        major: originalData.major || '',
        university: originalData.university || '',
        graduationYear: originalData.graduationYear || undefined,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Không thể tải thông tin cá nhân</p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin cá nhân</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Thông tin cá nhân</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} alt={profile.displayName} />
                <AvatarFallback className="text-2xl">
                  {profile.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {profile.displayName || 'Chưa có tên hiển thị'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Thành viên từ {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="displayName">Tên hiển thị *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName || ''}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập tên hiển thị"
                />
              </div>
              <div>
                <Label htmlFor="firstName">Tên *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập tên"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Họ *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập họ"
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="gender">Giới tính</Label>
                <select
                  id="gender"
                  value={formData.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value || undefined)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:dark:bg-gray-700"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Giới thiệu</Label>
              <textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                placeholder="Viết giới thiệu về bản thân"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 h-24 resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:dark:bg-gray-700"
              />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin liên lạc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <div>
                <Label htmlFor="city">Thành phố</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập thành phố"
                />
              </div>
              <div>
                <Label htmlFor="country">Quốc gia</Label>
                <Input
                  id="country"
                  value={formData.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập quốc gia"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Academic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin học tập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentId">Mã sinh viên</Label>
                <Input
                  id="studentId"
                  value={formData.studentId || ''}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập mã sinh viên"
                />
              </div>
              <div>
                <Label htmlFor="major">Chuyên ngành</Label>
                <Input
                  id="major"
                  value={formData.major || ''}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập chuyên ngành"
                />
              </div>
              <div>
                <Label htmlFor="university">Trường đại học</Label>
                <Input
                  id="university"
                  value={formData.university || ''}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập tên trường"
                />
              </div>
              <div>
                <Label htmlFor="graduationYear">Năm tốt nghiệp</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  min="2000"
                  max="2030"
                  value={formData.graduationYear || ''}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!isEditing}
                  placeholder="Nhập năm tốt nghiệp"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
