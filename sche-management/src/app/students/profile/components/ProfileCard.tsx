"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { StudentProfile } from "@/features/students/types/student";
import { Phone, Mail, Shield, Edit } from "lucide-react";

interface ProfileCardProps {
  profile: StudentProfile;
  userEmail: string;
  onEditClick: () => void;
}

export default function ProfileCard({ profile, userEmail, onEditClick }: ProfileCardProps) {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 mt-20">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Hồ sơ của tôi</CardTitle>
            <Button variant="outline" size="sm" onClick={onEditClick}>
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
                <h2 className="text-3xl font-bold text-gray-900">{profile.fullName}</h2>
                <Badge variant={getStatusBadgeVariant(profile.status)} className="ml-2">
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
            {/* Phone Number */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Phone className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                <p className="text-base font-semibold text-gray-900">{profile.phoneNumber}</p>
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
                  {userEmail || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

