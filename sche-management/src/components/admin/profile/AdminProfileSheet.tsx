"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Giả định có Separator
import { Mail, CalendarDays, Coins, Loader2, Info, Shield } from "lucide-react";

const ADMIN_WALLET_ID = "a0a0a0a0-a0a0-4a0a-a0a0-a0a0a0a0a0a1";

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
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <div className="mt-1">{icon}</div>
    <div className="flex flex-col">
      <span className="text-gray-500 text-xs uppercase">{label}</span>
      <span className="text-gray-900 text-sm font-medium break-words">
        {value}
      </span>
    </div>
  </div>
);

export default function AdminProfileSheetContent() {
  const { user, isLoading: isUserLoading } = useUserProfile();
  const { wallet, loading: isWalletLoading, loadWallet } = useWallet();

  // 1. Fetch thông tin ví Admin khi component mount
  useEffect(() => {
    // Chỉ fetch nếu chưa có dữ liệu ví hoặc ví đang tải
    if (!wallet && !isWalletLoading) {
      loadWallet(ADMIN_WALLET_ID);
    }
  }, [loadWallet, wallet, isWalletLoading]);

  // Kiểm tra loading người dùng (User Profile)
  if (isUserLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
        Đang tải thông tin người dùng...
      </div>
    );
  }

  // Kiểm tra không có dữ liệu người dùng
  if (!user) {
    return (
      <p className="p-4 text-center text-red-500">
        Không có dữ liệu người dùng.
      </p>
    );
  }

  // Helper để format số dư
  const formatBalance = (balance: number, currency: string) => {
    return `${balance.toLocaleString()} ${currency}`;
  };

  return (
    // Đã loại bỏ wrapper (max-w, mx-auto, py-10) để component này có thể nhúng vào SheetContent
    <div className="p-4 space-y-6">
      {/* Phần 1: Ảnh đại diện & Tên */}
      <div className="flex flex-col items-center space-y-3 pb-4">
        <Avatar className="w-24 h-24 border-4 border-indigo-500/30 shadow-md">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
          <AvatarFallback>
            {user.fullName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-bold text-gray-900 text-center">
          {user.fullName}
        </CardTitle>
        <div className="flex items-center gap-2 text-gray-700">
          <Shield className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold">Quản trị viên Hệ thống</span>
        </div>
      </div>

      <Separator />

      {/* Phần 2: Số dư Ví Admin (Hiển thị nổi bật) */}
      <Card className="bg-blue-50 border-blue-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center space-y-2">
          <Coins className="w-8 h-8 text-blue-600" />
          <span className="text-gray-600 text-sm font-semibold">
            Số dư Ví Hệ thống
          </span>
          {isWalletLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          ) : wallet && wallet.balance !== undefined ? (
            <span className="text-3xl font-extrabold text-blue-700">
              {formatBalance(wallet.balance, wallet.currency)}
            </span>
          ) : (
            <span className="text-sm text-red-500">Không tải được số dư</span>
          )}
        </CardContent>
      </Card>

      {/* Phần 3: Thông tin chi tiết (Vertical List) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-lg font-semibold text-gray-700">
          Chi tiết Tài khoản
        </h3>

        <DetailItem
          icon={<Mail className="w-5 h-5 text-gray-500" />}
          label="Email"
          value={user.email}
        />

        <DetailItem
          icon={<CalendarDays className="w-5 h-5 text-green-500" />}
          label="Ngày tham gia"
          value={new Date(user.createdAt).toLocaleDateString("vi-VN")}
        />

        {/* Ngày tạo Ví (Nếu có) */}
        {wallet && wallet.createdAt && (
          <DetailItem
            icon={<CalendarDays className="w-5 h-5 text-gray-500" />}
            label="Ngày tạo Ví"
            value={new Date(wallet.createdAt).toLocaleDateString("vi-VN")}
          />
        )}
      </div>
    </div>
  );
}
