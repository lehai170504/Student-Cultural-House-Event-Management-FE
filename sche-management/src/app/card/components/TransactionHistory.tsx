import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Transaction {
  id: number;
  walletId: number;
  counterpartyId: number | null;
  txnType: string;
  amount: number;
  referenceType: string;
  referenceId: number | null;
  createdAt: string | null;
}

interface TransactionHistoryProps {
  history: Transaction[];
  historyLoading: boolean;
  historyPage: number;
  historySize: number;
  onPageChange: (page: number) => void;
  numberFormatter: Intl.NumberFormat;
}

export default function TransactionHistory({
  history,
  historyLoading,
  historyPage,
  historySize,
  onPageChange,
  numberFormatter,
}: TransactionHistoryProps) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Lịch sử điểm thưởng
      </h2>

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
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {h.txnType}
                    </td>
                    <td className="px-4 py-3 text-orange-600 font-semibold">
                      {h.amount > 0 ? "+" : ""}
                      {numberFormatter.format(h.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{h.referenceType}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {h.createdAt
                        ? new Date(h.createdAt).toLocaleString()
                        : "—"}
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
                  onClick={() => onPageChange(Math.max(1, historyPage - 1))}
                  className={
                    historyLoading || historyPage <= 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(historyPage + 1)}
                  className={
                    historyLoading || history.length < historySize
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

