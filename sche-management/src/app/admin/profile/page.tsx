"use client";

import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CalendarDays } from "lucide-react";

export default function Profile() {
  const { user, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <p className="text-center py-20 text-gray-500 text-lg">
        Đang tải thông tin người dùng...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center py-20 text-red-500 text-lg">
        Không có dữ liệu người dùng.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="w-28 h-28 border-4 border-primary/20">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
            <AvatarFallback>
              {user.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center sm:text-left space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-900">
              {user.fullName}
            </CardTitle>
            <div className="flex items-center gap-2 justify-center sm:justify-start text-gray-600">
              <Mail className="w-5 h-5" />
              <span>{user.email}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-sm">
            <CalendarDays className="w-6 h-6 text-green-500 mb-2" />
            <span className="text-gray-500 text-sm">Ngày tạo</span>
            <span className="font-medium">
              {new Date(user.createdAt).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
