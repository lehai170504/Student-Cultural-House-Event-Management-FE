"use client";

import { useState, Suspense, lazy, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, RotateCw, CheckSquare } from "lucide-react";

// 🌟 Import hook và type
import { useInvoices } from "../hooks/useInvoices";

const ViewDetailInvoice = lazy(() => import("./ViewDetailInvoice"));

export default function RedemptionInvoiceTable() {
  const {
    allRedemptions,
    redemptionMeta,
    loadingAllRedemptions,
    saving,
    loadAllRedemptions,
    deliverInvoice,
    clearInvoiceError,
  } = useInvoices();

  const [search, setSearch] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [processingInvoiceId, setProcessingInvoiceId] = useState<string | null>(
    null
  );

  // Pagination state
  const [page, setPage] = useState(1);
  const size = 10;

  // 1. Tải dữ liệu khi component mount hoặc page thay đổi
  useEffect(() => {
    loadAllRedemptions(page, size);
  }, [loadAllRedemptions, page]);

  // 2. Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredInvoices = Array.isArray(allRedemptions)
    ? allRedemptions.filter(
        (i) =>
          i.studentName?.toLowerCase().includes(search.toLowerCase()) ||
          i.productTitle?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // 3. Xử lý đánh dấu Đã giao hàng
  const handleDeliverInvoice = useCallback(
    async (invoiceId: string) => {
      setProcessingInvoiceId(invoiceId);
      clearInvoiceError();

      try {
        const success = await deliverInvoice(invoiceId);
        if (success) {
          // Tải lại danh sách sau khi giao hàng thành công
          loadAllRedemptions(page, size);
        }
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã giao:", error);
      } finally {
        setProcessingInvoiceId(null);
      }
    },
    [deliverInvoice, loadAllRedemptions, clearInvoiceError, page]
  );

  // 4. Hàm hiển thị Badge Trạng thái
  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: "bg-yellow-100 text-yellow-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      COMPLETED: "bg-blue-100 text-blue-800",
    };
    const classes =
      statusMap[status as keyof typeof statusMap] ||
      "bg-gray-200 text-gray-700";

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}
      >
        {status}
      </span>
    );
  };

  // 5. Kiểm tra trạng thái xử lý
  const isProcessing = (invoiceId: string) =>
    processingInvoiceId === invoiceId && saving;

  // Pagination controls
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const nextPage = () =>
    setPage((p) =>
      redemptionMeta ? Math.min(p + 1, redemptionMeta.totalPages) : p
    );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý Hóa đơn Đổi quà
              </h1>
              <p className="text-lg text-gray-600">
                Tổng số hóa đơn: <strong>{filteredInvoices.length}</strong>
              </p>
            </div>

            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm theo Tên SV/Sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[300px] rounded-lg shadow-sm"
              />
              <Button
                onClick={() => loadAllRedemptions(page, size)}
                disabled={loadingAllRedemptions}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                <RotateCw
                  className={`h-4 w-4 mr-2 ${
                    loadingAllRedemptions ? "animate-spin" : ""
                  }`}
                />{" "}
                Tải lại
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {[
                    "STT", // ⭐ Thay Mã HĐ bằng STT
                    "Sinh viên",
                    "Sản phẩm",
                    "Số lượng",
                    "Tổng phí",
                    "Trạng thái",
                    "Thời gian tạo",
                    "Hành động",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="px-6 py-3 text-gray-700 font-semibold"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loadingAllRedemptions ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-gray-500"
                    >
                      <RotateCw className="inline animate-spin mr-2 h-4 w-4" />{" "}
                      Đang tải danh sách hóa đơn...
                    </TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-gray-500"
                    >
                      Không có hóa đơn nào được tìm thấy.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice, index) => (
                    <TableRow
                      key={invoice.invoiceId}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="px-6 py-4 font-medium text-gray-800">
                        {/* ⭐ STT tính theo page + size */}
                        {(page - 1) * size + index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600">
                        {invoice.studentName}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600">
                        {invoice.productTitle}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600">
                        {invoice.quantity}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600 font-semibold">
                        {invoice.totalCost.toLocaleString()} {invoice.currency}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600">
                        {invoice.createdAt
                          ? new Date(invoice.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      <TableCell className="px-6 py-4 flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() =>
                            setSelectedInvoiceId(invoice.invoiceId.toString())
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {invoice.status === "PENDING" && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600"
                            onClick={() =>
                              handleDeliverInvoice(invoice.invoiceId.toString())
                            }
                            disabled={isProcessing(
                              invoice.invoiceId.toString()
                            )}
                          >
                            {isProcessing(invoice.invoiceId.toString()) ? (
                              <RotateCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckSquare className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 🌟 Pagination */}
          {redemptionMeta && redemptionMeta.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <Button
                onClick={prevPage}
                disabled={page <= 1}
                className="px-4 py-1 bg-gray-200 disabled:opacity-50"
              >
                Prev
              </Button>
              <span>
                Page {page} / {redemptionMeta.totalPages}
              </span>
              <Button
                onClick={nextPage}
                disabled={page >= redemptionMeta.totalPages}
                className="px-4 py-1 bg-gray-200 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}

          <div className="text-sm text-gray-600 mt-2">
            Hiển thị {filteredInvoices.length} hóa đơn trên trang này.
          </div>
        </div>
      </section>

      {/* 🌟 Modal Chi tiết Hóa đơn */}
      <Suspense fallback={<div>Đang tải chi tiết hóa đơn...</div>}>
        {selectedInvoiceId && (
          <ViewDetailInvoice
            invoiceId={selectedInvoiceId}
            open={!!selectedInvoiceId}
            onClose={() => setSelectedInvoiceId(null)}
          />
        )}
      </Suspense>
    </main>
  );
}
