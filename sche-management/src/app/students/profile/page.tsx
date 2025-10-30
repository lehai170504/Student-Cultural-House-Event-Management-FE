"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { studentService } from "@/features/students/services/studentService";
import type { StudentProfile } from "@/features/students/types/student";
import { User, Phone, Mail, Building2, Calendar, Shield, Edit, Loader2 } from "lucide-react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state for complete profile
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await studentService.getProfile();
        setProfile(data);
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        console.error("Error status:", err?.response?.status);
        // If any error getting profile, show complete profile dialog
        // This means profile doesn't exist yet
        setShowCompleteDialog(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim() || !avatarUrl.trim()) {
      setFormError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      
      // Complete profile
      const completedProfile = await studentService.completeProfile({
        phoneNumber: phoneNumber.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      
      setProfile(completedProfile);
      setShowCompleteDialog(false);
      setPhoneNumber("");
      setAvatarUrl("");
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Không thể hoàn thiện profile");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "SUSPENDED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Không hoạt động";
      case "SUSPENDED":
        return "Tạm ngưng";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {profile && (
        <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Hồ sơ của tôi</CardTitle>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar className="h-32 w-32 border-4 border-orange-100">
                {profile.avatarUrl ? (
                  <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                ) : null}
                <AvatarFallback className="bg-orange-500 text-white text-3xl">
                  {getInitials(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {profile.fullName}
                  </h2>
                  <Badge
                    variant={getStatusBadgeVariant(profile.status)}
                    className="ml-2"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {getStatusLabel(profile.status)}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600">{profile.universityName}</p>
              </div>
            </div>

            <Separator />

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">ID</p>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.id}
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Mail className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.email || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {/* University */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Trường đại học</p>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.universityName}
                  </p>
                </div>
              </div>

              {/* University ID */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Mã trường đại học</p>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.universityId}
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Ngày tạo</p>
                  <p className="text-base font-semibold text-gray-900">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
                      : "Chưa có thông tin"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Complete Profile Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px]" showCloseButton={false}>
          <form onSubmit={handleCompleteProfile}>
            <DialogHeader>
              <DialogTitle>Hoàn thiện hồ sơ</DialogTitle>
              <DialogDescription>
                Bạn cần cung cấp thêm thông tin để hoàn thiện hồ sơ của mình.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              {/* Avatar URL */}
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">URL Ảnh đại diện *</Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  placeholder="Nhập URL ảnh đại diện"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  required
                />
              </div>

              {formError && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {formError}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Hoàn thành"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
