'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  X,
  Upload,
  Camera,
  Shield,
  Lock
} from 'lucide-react';

interface User {
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  address: string;
  faculty: string;
  interests: string[];
  qrCodeIdentifier: string;
  pointBalance: number;
  joinDate?: string;
  totalPoints?: number;
  level?: string;
  eventsAttended?: number;
  eventsOrganized?: number;
}

interface EditProfileProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

export default function EditProfile({ user, onSave, onCancel }: EditProfileProps) {
  const [editedUser, setEditedUser] = useState(user);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editedUser.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    if (!editedUser.userName.trim()) {
      newErrors.userName = 'Tên đăng nhập không được để trống';
    } else if (editedUser.userName.length < 3) {
      newErrors.userName = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!editedUser.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!editedUser.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(editedUser.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (!editedUser.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    }

    if (!editedUser.faculty.trim()) {
      newErrors.faculty = 'Khoa/ngành học không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(editedUser);
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload process
    try {
      // In real app, upload to server here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedUser(prev => ({
          ...prev,
          avatarUrl: e.target?.result as string
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Chỉnh sửa thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân và tài khoản của bạn
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ảnh đại diện</CardTitle>
          <CardDescription>
            Tải lên ảnh đại diện mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={editedUser.avatarUrl} alt={editedUser.fullName} />
              <AvatarFallback className="text-lg">
                {editedUser.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Camera className="h-4 w-4 mr-2 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Tải lên
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Use default avatar
                    setEditedUser(prev => ({
                      ...prev,
                      avatarUrl: ''
                    }));
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Chụp ảnh
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                JPG, PNG hoặc GIF. Tối đa 2MB.
              </p>
            </div>
            
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật thông tin cơ bản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={editedUser.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Tên đăng nhập *</Label>
              <Input
                id="userName"
                value={editedUser.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                placeholder="Nhập tên đăng nhập"
              />
              {errors.userName && (
                <p className="text-sm text-red-500">{errors.userName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={editedUser.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập địa chỉ email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại *</Label>
              <Input
                id="phoneNumber"
                value={editedUser.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Nhập số điện thoại"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ *</Label>
            <Textarea
              id="address"
              value={editedUser.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Nhập địa chỉ đầy đủ"
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty">Khoa/Ngành học *</Label>
            <Input
              id="faculty"
              value={editedUser.faculty}
              onChange={(e) => handleInputChange('faculty', e.target.value)}
              placeholder="Nhập khoa/ngành học"
            />
            {errors.faculty && (
              <p className="text-sm text-red-500">{errors.faculty}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Sở thích</Label>
            <div className="space-y-2">
              <Input
                placeholder="Thêm sở thích mới (nhấn Enter để thêm)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const newInterest = input.value.trim();
                    if (newInterest && !editedUser.interests.includes(newInterest)) {
                      setEditedUser(prev => ({
                        ...prev,
                        interests: [...prev.interests, newInterest]
                      }));
                      input.value = '';
                    }
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {editedUser.interests.map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => {
                      setEditedUser(prev => ({
                        ...prev,
                        interests: prev.interests.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    {interest} ×
                  </Badge>
                ))}
              </div>
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
            Quản lý bảo mật và quyền riêng tư
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Mật khẩu</div>
                <div className="text-sm text-gray-500">
                  Cập nhật mật khẩu để bảo mật tài khoản
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Đổi mật khẩu
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Xác thực email</div>
                <div className="text-sm text-gray-500">
                  Email đã được xác thực
                </div>
              </div>
            </div>
            <Badge variant="secondary">Đã xác thực</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
