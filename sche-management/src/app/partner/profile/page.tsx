"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import Image from "next/image";
import { User, Mail, Phone, Building2, Wallet, Calendar, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PartnerProfile = {
  id: string | number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  organizationName?: string;
  createdAt?: string;
  status?: string;
  walletId?: string | number;
};

export default function PartnerProfilePage() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/me"); // baseURL includes /api/v1
        const data = res?.data?.data ?? res?.data;
        // Backend đã đổi sang UUID (string), lấy id hoặc uuid
        const partnerId = data?.id || data?.uuid || data?.sub;
        setProfile({
          id: partnerId ? String(partnerId) : data?.id,
          fullName: data?.fullName || data?.name || "Partner",
          email: data?.contactEmail || data?.email,
          phoneNumber: data?.contactPhone || data?.phoneNumber,
          avatarUrl: data?.avatarUrl,
          organizationName: data?.organizationType || data?.organizationName || data?.universityName,
          createdAt: data?.createdAt,
          status: data?.status,
          walletId: data?.walletId,
        });
      } catch (e: any) {
        setError(e?.response?.data?.message || "Không tải được hồ sơ");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const letter = String(profile?.fullName || profile?.email || "P").charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-8 w-8 text-orange-500" />
          Thông tin Partner
        </h2>
        <p className="text-gray-600 mt-1">Xem và quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Header với avatar */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt="avatar"
                  width={96}
                  height={96}
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white font-bold text-4xl">{letter}</span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-2">
                <User className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-3xl font-bold mb-1">{profile.fullName}</h3>
              <p className="text-orange-100 text-lg">{profile.email}</p>
              <div className="mt-3">
                <span className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                  profile.status === "ACTIVE" && "bg-green-500/20 text-white border border-green-300",
                  profile.status === "INACTIVE" && "bg-gray-500/20 text-white border border-gray-300",
                  "bg-yellow-500/20 text-white border border-yellow-300"
                )}>
                  {profile.status === "ACTIVE" && <CheckCircle2 className="h-4 w-4" />}
                  {profile.status || "PENDING"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Chi tiết tài khoản
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-3 rounded-lg">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Họ và tên</p>
                <p className="font-semibold text-gray-900">{profile.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-gray-900 break-all">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                <p className="font-semibold text-gray-900">{profile.phoneNumber || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Tổ chức</p>
                <p className="font-semibold text-gray-900">{profile.organizationName || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Wallet className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Wallet ID</p>
                <p className="font-semibold text-gray-900">{profile.walletId || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-pink-50 p-3 rounded-lg">
                <Calendar className="h-5 w-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
                <p className="font-semibold text-gray-900">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }) : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


