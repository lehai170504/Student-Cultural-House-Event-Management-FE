// src/features/partner/components/PartnerProfileSheetContent.tsx
"use client";

import { useEffect } from "react";
// 🌟 Import các components UI cần thiết
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Building,
  CheckCircle,
  XCircle,
  Loader2,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";

// Component helper để hiển thị chi tiết (Key-Value)
const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
    <div className="mt-1 flex-shrink-0">{icon}</div>
    <div className="flex flex-col">
      <span className="text-gray-500 text-xs uppercase">{label}</span>
      <span className="text-gray-900 text-sm font-medium break-words">
        {value}
      </span>
    </div>
  </div>
);

// 🌟 Đã đổi tên thành Component hiển thị Nội dung Sheet
export default function PartnerProfileSheetContent() {
  const { user, isLoading, error, loadProfile } = useUserProfile();

  useEffect(() => {
    // 🌟 Chỉ load profile nếu nó chưa được tải (Nếu cần)
    loadProfile();
  }, [loadProfile]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
        Đang tải thông tin hồ sơ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-center gap-2 m-4">
        <XCircle className="h-5 w-5" />
        <p className="text-sm">Lỗi tải hồ sơ: {error}</p>
      </div>
    );
  }

  if (!user) return null;

  // Helper cho trạng thái
  const StatusBadge = ({ status }: { status: string }) => {
    const isActive = status === "ACTIVE";
    const color = isActive ? "text-green-600" : "text-red-600";
    const bg = isActive ? "bg-green-100" : "bg-red-100";
    const Icon = isActive ? CheckCircle : XCircle;

    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
        <span className={`text-sm font-semibold ${color}`}>{status}</span>
      </div>
    );
  };

  return (
    // 🌟 Wrapper không có padding/margin để nhúng vào SheetContent
    <div className="p-4 space-y-6">
      {/* Phần 1: Ảnh đại diện & Tên (Kiểu Card nổi bật) */}
      <div className="flex flex-col items-center space-y-4 pt-4">
        <Avatar className="w-24 h-24 border-4 border-orange-500/30 shadow-xl">
          <AvatarImage
            src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
          />
          <AvatarFallback className="bg-orange-500 text-white font-extrabold text-5xl">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <CardTitle className="text-2xl font-bold text-gray-900 text-center">
          {user.name}
        </CardTitle>

        <div className="flex items-center gap-2 text-gray-700">
          <ShieldCheck className="w-5 h-5 text-orange-500" />
          <span className="text-base font-semibold">
            Đối tác {user.organizationType}
          </span>
        </div>

        <StatusBadge status={user.status} />
      </div>

      <Separator />

      {/* Phần 2: Thông tin chi tiết (Vertical List Grid) */}
      <div className="space-y-6 px-2">
        <h3 className="text-xl font-bold text-gray-700 border-l-4 border-orange-500 pl-3">
          Thông tin liên hệ & Tổ chức
        </h3>

        {/* 🌟 ĐÃ SỬA: Thay thế grid bằng flex flex-col để hiển thị dọc */}
        <div className="flex flex-col gap-3">
          <DetailItem
            icon={<User className="h-5 w-5 text-orange-500" />}
            label="Tên Đối tác"
            value={user.name}
          />

          <DetailItem
            icon={<Mail className="h-5 w-5 text-blue-500" />}
            label="Email liên hệ"
            value={user.contactEmail}
          />

          <DetailItem
            icon={<Phone className="h-5 w-5 text-green-500" />}
            label="Số điện thoại"
            value={user.contactPhone}
          />

          <DetailItem
            icon={<Building className="h-5 w-5 text-purple-500" />}
            label="Loại tổ chức"
            value={user.organizationType}
          />

          {user.createdAt && (
            <DetailItem
              icon={<CalendarDays className="h-5 w-5 text-gray-500" />}
              label="Ngày tham gia"
              value={new Date(user.createdAt).toLocaleDateString("vi-VN")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
