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
  Edit, 
  Save, 
  X,
  Calendar,
  Award,
  Shield
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

interface ProfileDetailsProps {
  user: User;
  onUpdate?: (updatedUser: User) => void;
}

export default function ProfileDetails({ user, onUpdate }: ProfileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedUser);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Quản lý thông tin cá nhân và liên hệ của bạn
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={editedUser.avatarUrl} alt={editedUser.fullName} />
              <AvatarFallback className="text-lg">
                {editedUser.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{editedUser.fullName}</h3>
              <p className="text-sm text-gray-500">@{editedUser.userName}</p>
              {isEditing && (
                <Button variant="outline" size="sm" className="mt-2">
                  Đổi ảnh đại diện
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={editedUser.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Tên đăng nhập</Label>
              <Input
                id="userName"
                value={editedUser.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedUser.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                value={editedUser.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                value={editedUser.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faculty">Khoa/Ngành học</Label>
              <Input
                id="faculty"
                value={editedUser.faculty}
                onChange={(e) => handleInputChange('faculty', e.target.value)}
                disabled={!isEditing}
                placeholder="Nhập khoa/ngành học"
              />
            </div>

            <div className="space-y-2">
              <Label>Sở thích</Label>
              <div className="flex flex-wrap gap-2">
                {editedUser.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {interest}
                  </Badge>
                ))}
              </div>
              {isEditing && (
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
                  <div className="flex flex-wrap gap-1">
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
              )}
            </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Thống kê tài khoản
          </CardTitle>
          <CardDescription>
            Thông tin về hoạt động và thành tích của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {user.totalPoints || 0}
              </div>
              <div className="text-sm text-gray-500">Điểm tích lũy</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {user.eventsAttended || 0}
              </div>
              <div className="text-sm text-gray-500">Sự kiện tham gia</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {user.eventsOrganized || 0}
              </div>
              <div className="text-sm text-gray-500">Sự kiện tổ chức</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Thông tin tài khoản
          </CardTitle>
          <CardDescription>
            Chi tiết về tài khoản và bảo mật
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Ngày tham gia</div>
                <div className="text-sm text-gray-500">
                  {user.joinDate ? new Date(user.joinDate).toLocaleDateString('vi-VN') : 'Không có thông tin'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Cấp độ thành viên</div>
                <div className="text-sm text-gray-500">
                  <Badge variant="secondary">{user.level || 'Bronze'}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
