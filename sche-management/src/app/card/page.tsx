"use client";

import PublicNavbar from "@/components/PublicNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/config/axiosInstance";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function VirtualCardPage() {
  const numberFormatter = useMemo(() => new Intl.NumberFormat("vi-VN"), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<{
    id: number;
    ownerType: string;
    balance: number;
    currency: string;
  } | null>(null);
  const [memberName, setMemberName] = useState<string>("");
  const [history, setHistory] = useState<
    Array<{
      id: number;
      walletId: number;
      counterpartyId: number | null;
      txnType: string;
      amount: number;
      referenceType: string;
      referenceId: number | null;
      createdAt: string | null;
    }>
  >([]);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [historySize, setHistorySize] = useState<number>(10);
  const [historySort, setHistorySort] = useState<string>("createdAt,desc");
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const loadHistory = async (p: number, s: number, so: string) => {
    setHistoryLoading(true);
    try {
      const hRes = await axiosInstance.get<any>("/wallets/me/history", {
        params: { page: p, size: s, sort: so },
      });
      const hPayload = hRes?.data?.data ?? hRes?.data ?? [];
      setHistory(Array.isArray(hPayload) ? hPayload : []);
      setHistoryPage(p);
      setHistorySize(s);
      setHistorySort(so || "createdAt,desc");
    } catch (e) {
      // ignore history error but keep other data
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const meRes = await axiosInstance.get<any>("/me");
        const meData = meRes?.data?.data ?? meRes?.data ?? {};
        const walletId = meData?.walletId;
        setMemberName(meData?.fullName || meData?.name || "");
        if (!walletId) throw new Error("Không tìm thấy walletId trong hồ sơ");
        const wRes = await axiosInstance.get<any>(`/wallets/${walletId}`);
        const wData = wRes?.data?.data ?? wRes?.data ?? {};
        setWallet({
          id: wData?.id ?? walletId,
          ownerType: wData?.ownerType ?? "STUDENT",
          balance: Number(wData?.balance ?? 0),
          currency: wData?.currency ?? "VND",
        });

        // Load wallet history (initial)
        await loadHistory(historyPage, historySize, historySort);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Không tải được ví");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <section className="container mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Thẻ thành viên ảo</h1>
            <p className="text-gray-600">Xem thông tin thẻ và điểm tích lũy của bạn.</p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-2xl blur opacity-30"></div>
            <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
              {/* diagonal light sheen */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rotate-12 bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-2xl" />
              {/* subtle dot-grid pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />
              {/* slow shimmer sweep */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -inset-y-10 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-[cardShimmer_10s_linear_infinite]" />
              </div>
              {/* watermark logo from public */}
              <div className="pointer-events-none absolute right-3 top-3 select-none">
                <Image src="/LogoRMBG.png" alt="SVH Events" width={96} height={96} priority className="object-contain" />
              </div>
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="text-sm uppercase tracking-widest text-gray-300">Student Cultural House</div>
                </div>

                {/* chip + contactless */}
                <div className="mt-5 flex items-center gap-3">
                  <svg width="48" height="32" viewBox="0 0 54 36" xmlns="http://www.w3.org/2000/svg" className="drop-shadow">
                    <rect x="1" y="1" width="52" height="34" rx="6" fill="url(#grad)" stroke="#d4d4d8" strokeWidth="1" />
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="54" y2="36" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#eab308" />
                        <stop offset="1" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <rect x="10" y="10" width="12" height="2" fill="#78350f" opacity=".4" />
                    <rect x="10" y="16" width="24" height="2" fill="#78350f" opacity=".4" />
                    <rect x="10" y="22" width="18" height="2" fill="#78350f" opacity=".4" />
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/80">
                    <path d="M7 8c2.667 2 2.667 6 0 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M11 6c4 3 4 9 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M15 4c5.333 4 5.333 12 0 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>

                <div className="mt-6">
                  <div className="text-lg md:text-2xl font-semibold tracking-widest">
                    {memberName ? `Ví của ${memberName}` : "Ví của tôi"}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-400">Chủ ví</div>
                    <div className="font-medium">{memberName || "—"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">Loại chủ sở hữu</div>
                    <div className="font-medium">{wallet?.ownerType || "—"}</div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <div className="text-gray-400">Đơn vị</div>
                    <div className="font-medium">{wallet?.currency || "—"}</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-300">Số dư</div>
                  <div className="text-2xl font-bold text-orange-400">{loading ? "..." : numberFormatter.format(wallet?.balance ?? 0)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          {error ? (
            <div className="text-center text-sm text-red-600">{error}</div>
          ) : null}

          {/* Lịch sử điểm thưởng */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Lịch sử điểm thưởng</h2>

            <div className="bg-white rounded-xl shadow border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600">
                      <th className="text-left px-4 py-3">Loại giao dịch</th>
                      <th className="text-left px-4 py-3">Số điểm</th>
                      <th className="text-left px-4 py-3">Nguồn</th>
                      <th className="text-left px-4 py-3">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                          {historyLoading ? "Đang tải..." : "Chưa có giao dịch"}
                        </td>
                      </tr>
                    ) : (
                      history.map((h) => (
                        <tr key={h.id} className="border-t">
                          <td className="px-4 py-3 font-medium text-gray-800">{h.txnType}</td>
                          <td className="px-4 py-3 text-orange-600 font-semibold">
                            {h.amount > 0 ? "+" : ""}{numberFormatter.format(h.amount)}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{h.referenceType}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {h.createdAt ? new Date(h.createdAt).toLocaleString() : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 text-sm">
                <div>Trang {historyPage}</div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => loadHistory(Math.max(1, historyPage - 1), historySize, historySort)}
                        className={historyLoading || historyPage <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => loadHistory(historyPage + 1, historySize, historySort)}
                        className={historyLoading || history.length < historySize ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

{/* local keyframes for shimmer */}
<style jsx>{`
@keyframes cardShimmer {
  0% { transform: translateX(0); opacity: .0; }
  5% { opacity: .35; }
  50% { transform: translateX(250%); opacity: .2; }
  95% { opacity: .0; }
  100% { transform: translateX(250%); opacity: .0; }
}
`}</style>


