"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, History, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "@/config/axiosInstance";
import { partnerService } from "@/features/partner/services/partnerService";
import { cn } from "@/lib/utils";

export default function PartnerWalletPage() {
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const me = await axiosInstance.get("/me");
        const data = me?.data?.data ?? me?.data;
        const pid = data?.id;
        setPartnerId(pid ?? null);
        if (pid) {
          const w = await partnerService.getWallet(pid);
          setWallet(w);
          const h: any = await partnerService.getWalletHistory(pid, { page: 0, size: 20 });
          // Support both paged response and array
          const items = Array.isArray(h)
            ? h
            : (h?.data?.content ?? h?.content ?? h?.data ?? []);
          setHistory(items);
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || "Không tải được thông tin ví");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const balance = wallet?.balance ?? wallet?.amount ?? wallet?.availableBalance ?? 0;
  const currency = wallet?.currency || "COIN";
  const walletIdDisplay = wallet?.id ?? wallet?.walletId ?? partnerId;
  const ownerType = wallet?.ownerType ?? "-";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-gray-600">Đang tải thông tin ví...</p>
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Ví của Đối tác</h2>
        <p className="text-gray-600 mt-1">Quản lý số dư và lịch sử giao dịch</p>
      </div>

      {/* Wallet summary card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/20 p-4 rounded-full">
            <Wallet className="h-8 w-8" />
          </div>
          <div>
            <p className="text-orange-100 text-sm">Số dư hiện tại</p>
            <h3 className="text-4xl font-bold">
              {balance.toLocaleString("vi-VN")} {currency}
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-orange-400/30 pt-4">
          <div>
            <p className="text-orange-100 text-sm">Wallet ID</p>
            <p className="font-semibold text-lg">{walletIdDisplay ?? "-"}</p>
          </div>
          <div>
            <p className="text-orange-100 text-sm">Chủ sở hữu</p>
            <p className="font-semibold text-lg">{ownerType} #{partnerId ?? "-"}</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <History className="h-5 w-5 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Lịch sử giao dịch</h3>
        </div>
        {history.length === 0 ? (
          <div className="p-12 text-center">
            <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có giao dịch</h3>
            <p className="text-gray-600">Lịch sử giao dịch sẽ hiển thị tại đây</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Thời gian</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Loại giao dịch</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-900">Số tiền</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Mô tả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((t: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {t.createdAt ? new Date(t.createdAt).toLocaleString("vi-VN") : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        t.txnType?.includes("TOPUP") && "bg-green-100 text-green-800",
                        t.txnType?.includes("TRANSFER") && "bg-blue-100 text-blue-800",
                        t.txnType?.includes("FUND") && "bg-purple-100 text-purple-800",
                        "bg-gray-100 text-gray-800"
                      )}>
                        {t.txnType || t.type || t.transactionType || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right">
                      {(t.amount ?? t.value ?? 0).toLocaleString("vi-VN")} {currency}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {t.referenceType || t.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


