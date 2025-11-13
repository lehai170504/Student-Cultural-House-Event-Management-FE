"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import { WalletTransaction } from "../types/wallet";

export default function WalletTransactionTable() {
  const {
    transactions = [],
    meta,
    loading = false,
    loadTransactions,
  } = useWallet();
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = meta?.pageSize ?? 10;
  const currentMetaPage = meta?.currentPage ?? 1;

  const fetchData = useCallback(
    async (page = 1) => {
      await loadTransactions({ page, pageSize });
      setCurrentPage(page);
    },
    [loadTransactions, pageSize]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const calculateStt = (index: number) =>
    (currentMetaPage - 1) * pageSize + index + 1;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString || "-";
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-full mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        Sổ Giao Dịch Ví (Admin View)
      </h1>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              {[
                "STT",
                "Loại Giao Dịch",
                "Số Tiền",
                "Tham Chiếu",
                "Thời Gian Tạo",
              ].map((title, index) => (
                <TableHead
                  key={title}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 ${
                    index === 2 ? "text-right" : "text-left"
                  }`}
                >
                  {title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  <Loader2 className="animate-spin w-6 h-6 mx-auto mb-2 text-indigo-500" />
                  Đang tải giao dịch...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  😔 Không có giao dịch nào được tìm thấy
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((txn: WalletTransaction, index: number) => (
                <TableRow
                  key={txn.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-4 py-3 text-gray-700">
                    {calculateStt(index)}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        txn.txnType.includes("TRANSFER_IN") ||
                        txn.txnType.includes("TOPUP") ||
                        txn.amount > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {txn.txnType}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 font-mono font-semibold text-right ${
                      txn.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {txn.amount.toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-600">
                    {txn.referenceType ? `${txn.referenceType} ` : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(txn.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
          Trang {currentMetaPage} trên {meta?.totalPages ?? 1} (Tổng cộng{" "}
          {meta?.totalItems ?? 0} giao dịch)
        </span>
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={loading || currentMetaPage <= 1}
            onClick={() => fetchData(currentMetaPage - 1)}
          >
            Trang trước
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={loading || currentMetaPage >= (meta?.totalPages ?? 1)}
            onClick={() => fetchData(currentMetaPage + 1)}
          >
            Trang sau
          </Button>
        </div>
      </div>
    </section>
  );
}
