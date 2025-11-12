"use client";

import PublicNavbar from "@/components/PublicNavbar";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import WalletCard from "./components/WalletCard";
import TransactionHistory from "./components/TransactionHistory";

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
      <section className="container mt-15 mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ví điện tử</h1>
            <p className="text-gray-600">Xem thông tin ví và số dư điểm tích lũy của bạn.</p>
          </div>

          {error ? (
            <div className="text-center text-sm text-red-600">{error}</div>
          ) : (
            <WalletCard
              wallet={wallet}
              memberName={memberName}
              loading={loading}
              numberFormatter={numberFormatter}
            />
          )}

          <TransactionHistory
            history={history}
            historyLoading={historyLoading}
            historyPage={historyPage}
            historySize={historySize}
            onPageChange={(page) => loadHistory(page, historySize, historySort)}
            numberFormatter={numberFormatter}
          />
        </div>
      </section>
    </main>
  );
}

