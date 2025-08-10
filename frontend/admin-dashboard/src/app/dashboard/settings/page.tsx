"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Shield, 
  Mail, 
  Database, 
  Globe, 
  Bell,
  Save,
  RefreshCw
} from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Edu Review Hub",
    siteDescription: "Nền tảng đánh giá và chia sẻ thông tin về giáo dục",
    siteUrl: "https://edureviewhub.com",
    adminEmail: "admin@edureviewhub.com",
    
    // Security Settings
    enableTwoFactor: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    
    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@edureviewhub.com",
    smtpPassword: "",
    enableEmailNotifications: true,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    logLevel: "info",
    maxFileSize: 10,
    
    // Notification Settings
    enableEmailAlerts: true,
    enableSMSAlerts: false,
    enablePushNotifications: true,
    alertFrequency: "immediate"
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Settings saved:", settings);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // TODO: Reset to default values
    console.log("Reset settings");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-600 mt-2">Quản lý cấu hình và thiết lập hệ thống</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Khôi phục
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Cài đặt chung
            </CardTitle>
            <CardDescription>
              Thông tin cơ bản về website và hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Tên website</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange("siteName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteUrl">URL website</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => handleSettingChange("siteUrl", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Mô tả website</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email quản trị</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleSettingChange("adminEmail", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Cài đặt bảo mật
            </CardTitle>
            <CardDescription>
              Cấu hình bảo mật và xác thực
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bật xác thực 2 yếu tố</Label>
                <p className="text-sm text-muted-foreground">
                  Yêu cầu mã xác thực khi đăng nhập
                </p>
              </div>
              <Switch
                checked={settings.enableTwoFactor}
                onCheckedChange={(checked) => handleSettingChange("enableTwoFactor", checked)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Thời gian phiên (phút)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange("maxLoginAttempts", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Độ dài mật khẩu tối thiểu</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleSettingChange("passwordMinLength", parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Cài đặt email
            </CardTitle>
            <CardDescription>
              Cấu hình SMTP và thông báo email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bật thông báo email</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi email thông báo cho người dùng
                </p>
              </div>
              <Switch
                checked={settings.enableEmailNotifications}
                onCheckedChange={(checked) => handleSettingChange("enableEmailNotifications", checked)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => handleSettingChange("smtpHost", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => handleSettingChange("smtpPort", parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={settings.smtpUser}
                  onChange={(e) => handleSettingChange("smtpUser", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => handleSettingChange("smtpPassword", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Cài đặt hệ thống
            </CardTitle>
            <CardDescription>
              Cấu hình hệ thống và hiệu suất
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chế độ bảo trì</Label>
                <p className="text-sm text-muted-foreground">
                  Tạm thời vô hiệu hóa website
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chế độ debug</Label>
                <p className="text-sm text-muted-foreground">
                  Hiển thị thông tin debug
                </p>
              </div>
              <Switch
                checked={settings.debugMode}
                onCheckedChange={(checked) => handleSettingChange("debugMode", checked)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logLevel">Mức độ log</Label>
                <select
                  id="logLevel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.logLevel}
                  onChange={(e) => handleSettingChange("logLevel", e.target.value)}
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Kích thước file tối đa (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange("maxFileSize", parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Cài đặt thông báo
            </CardTitle>
            <CardDescription>
              Cấu hình các loại thông báo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cảnh báo qua email</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi cảnh báo quan trọng qua email
                </p>
              </div>
              <Switch
                checked={settings.enableEmailAlerts}
                onCheckedChange={(checked) => handleSettingChange("enableEmailAlerts", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cảnh báo qua SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi cảnh báo qua tin nhắn SMS
                </p>
              </div>
              <Switch
                checked={settings.enableSMSAlerts}
                onCheckedChange={(checked) => handleSettingChange("enableSMSAlerts", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo push</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi thông báo push đến trình duyệt
                </p>
              </div>
              <Switch
                checked={settings.enablePushNotifications}
                onCheckedChange={(checked) => handleSettingChange("enablePushNotifications", checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alertFrequency">Tần suất cảnh báo</Label>
              <select
                id="alertFrequency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.alertFrequency}
                onChange={(e) => handleSettingChange("alertFrequency", e.target.value)}
              >
                <option value="immediate">Ngay lập tức</option>
                <option value="hourly">Hàng giờ</option>
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
