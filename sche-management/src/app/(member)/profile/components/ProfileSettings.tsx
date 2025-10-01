'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  Shield, 
  Lock, 
  Mail, 
  Smartphone,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  eventReminders: boolean;
  newEventAlerts: boolean;
  pointUpdates: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  deviceManagement: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  showActivity: boolean;
}

export default function ProfileSettings() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    eventReminders: true,
    newEventAlerts: true,
    pointUpdates: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    deviceManagement: true
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showActivity: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (key: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    
    // Reset password form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Cài đặt thông báo
          </CardTitle>
          <CardDescription>
            Quản lý cách bạn nhận thông báo từ hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Thông báo qua email</Label>
                <p className="text-sm text-gray-500">
                  Nhận thông báo quan trọng qua email
                </p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(value) => handleNotificationChange('emailNotifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Nhắc nhở sự kiện</Label>
                <p className="text-sm text-gray-500">
                  Nhắc nhở trước khi sự kiện diễn ra
                </p>
              </div>
              <Switch
                checked={notificationSettings.eventReminders}
                onCheckedChange={(value) => handleNotificationChange('eventReminders', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Thông báo sự kiện mới</Label>
                <p className="text-sm text-gray-500">
                  Thông báo khi có sự kiện mới phù hợp
                </p>
              </div>
              <Switch
                checked={notificationSettings.newEventAlerts}
                onCheckedChange={(value) => handleNotificationChange('newEventAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Cập nhật điểm</Label>
                <p className="text-sm text-gray-500">
                  Thông báo khi có thay đổi về điểm tích lũy
                </p>
              </div>
              <Switch
                checked={notificationSettings.pointUpdates}
                onCheckedChange={(value) => handleNotificationChange('pointUpdates', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Cập nhật hệ thống</Label>
                <p className="text-sm text-gray-500">
                  Thông báo về cập nhật và bảo trì hệ thống
                </p>
              </div>
              <Switch
                checked={notificationSettings.systemUpdates}
                onCheckedChange={(value) => handleNotificationChange('systemUpdates', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email marketing</Label>
                <p className="text-sm text-gray-500">
                  Nhận email về sản phẩm và dịch vụ mới
                </p>
              </div>
              <Switch
                checked={notificationSettings.marketingEmails}
                onCheckedChange={(value) => handleNotificationChange('marketingEmails', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bảo mật tài khoản
          </CardTitle>
          <CardDescription>
            Quản lý bảo mật và quyền riêng tư của tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Xác thực 2 yếu tố</Label>
                <p className="text-sm text-gray-500">
                  Thêm lớp bảo mật bổ sung cho tài khoản
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={securitySettings.twoFactorEnabled ? "default" : "secondary"}>
                  {securitySettings.twoFactorEnabled ? "Bật" : "Tắt"}
                </Badge>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(value) => handleSecurityChange('twoFactorEnabled', value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Cảnh báo đăng nhập</Label>
                <p className="text-sm text-gray-500">
                  Thông báo khi có đăng nhập từ thiết bị mới
                </p>
              </div>
              <Switch
                checked={securitySettings.loginAlerts}
                onCheckedChange={(value) => handleSecurityChange('loginAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Quản lý thiết bị</Label>
                <p className="text-sm text-gray-500">
                  Xem và quản lý các thiết bị đã đăng nhập
                </p>
              </div>
              <Switch
                checked={securitySettings.deviceManagement}
                onCheckedChange={(value) => handleSecurityChange('deviceManagement', value)}
              />
            </div>
          </div>

          <Separator />

          {/* Change Password */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Đổi mật khẩu</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button onClick={handleChangePassword} disabled={isSaving}>
                <Lock className="h-4 w-4 mr-2" />
                {isSaving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quyền riêng tư
          </CardTitle>
          <CardDescription>
            Kiểm soát thông tin cá nhân được hiển thị
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Hiển thị hồ sơ</Label>
              <div className="flex gap-2">
                {[
                  { value: 'public', label: 'Công khai' },
                  { value: 'private', label: 'Riêng tư' },
                  { value: 'friends', label: 'Bạn bè' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={privacySettings.profileVisibility === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePrivacyChange('profileVisibility', option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Hiển thị email</Label>
                <p className="text-sm text-gray-500">
                  Cho phép người khác xem email của bạn
                </p>
              </div>
              <Switch
                checked={privacySettings.showEmail}
                onCheckedChange={(value) => handlePrivacyChange('showEmail', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Hiển thị số điện thoại</Label>
                <p className="text-sm text-gray-500">
                  Cho phép người khác xem số điện thoại của bạn
                </p>
              </div>
              <Switch
                checked={privacySettings.showPhone}
                onCheckedChange={(value) => handlePrivacyChange('showPhone', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Hiển thị hoạt động</Label>
                <p className="text-sm text-gray-500">
                  Cho phép người khác xem hoạt động gần đây của bạn
                </p>
              </div>
              <Switch
                checked={privacySettings.showActivity}
                onCheckedChange={(value) => handlePrivacyChange('showActivity', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isSaving} size="lg">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Đang lưu...' : 'Lưu tất cả cài đặt'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
