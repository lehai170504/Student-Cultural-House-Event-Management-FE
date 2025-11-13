"use client";

import { useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";

export default function PartnerProfilePage() {
  const { user, isLoading, error, loadProfile } = useUserProfile();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-center gap-2 max-w-xl mx-auto">
        <XCircle className="h-5 w-5" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  const letter = String(user?.name || "P")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-4 sm:px-0">
      {/* Avatar & basic info */}
      <div className="text-center">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg">
          <span className="text-white font-extrabold text-5xl">{letter}</span>
        </div>
        <h2 className="text-3xl font-bold mt-4 text-gray-800">{user.name}</h2>
        <p className="text-gray-500 mt-1">{user.contactEmail}</p>
      </div>

      {/* Info card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 transition-transform hover:scale-[1.02] duration-200">
        <h3 className="text-xl font-semibold mb-6 text-gray-700">
          Thông tin chi tiết
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-gray-400 text-sm">Tên</p>
              <p className="text-gray-700 font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-gray-700 font-medium">{user.contactEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-gray-400 text-sm">Loại tổ chức</p>
              <p className="text-gray-700 font-medium">
                {user.organizationType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Số điện thoại</p>
              <p className="text-gray-700 font-medium">{user.contactPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-1 sm:col-span-2">
            {user.status === "ACTIVE" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="text-gray-400 text-sm">Trạng thái</p>
              <p
                className={`font-medium ${
                  user.status === "ACTIVE" ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
