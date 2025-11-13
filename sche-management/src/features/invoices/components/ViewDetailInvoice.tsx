"use client";

import { useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCw, CheckSquare, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useInvoices } from "../hooks/useInvoices";

// Giả định component hiển thị chi tiết hóa đơn (chỉ đọc)
import InvoiceDetailForm from "./InvoiceDetailForm";

interface ViewDetailInvoiceProps {
  invoiceId: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ViewDetailInvoice({
  invoiceId,
  open,
  onClose,
  onSuccess,
}: ViewDetailInvoiceProps) {
  const {
    detail,
    loadingDetail,
    saving,
    loadDetail,
    deliverInvoice,
    cancelRedemption,
    clearInvoiceError,
    error,
  } = useInvoices();

  // Load chi tiết hóa đơn
  useEffect(() => {
    if (open && invoiceId) {
      loadDetail(invoiceId);
      clearInvoiceError();
    } else {
      // Có thể reset detail khi đóng modal nếu cần
    }
  }, [invoiceId, open, loadDetail, clearInvoiceError]);

  // Kiểm tra trạng thái của hóa đơn đang xem
  const currentInvoice = useMemo(() => {
    return detail?.invoiceId === invoiceId ? detail : null;
  }, [detail, invoiceId]);

  // Hàm xử lý Đánh dấu đã giao
  const handleDeliver = useCallback(async () => {
    if (!invoiceId || !currentInvoice) return;

    try {
      const success = await deliverInvoice(invoiceId);
      if (success) {
        toast.success(`Hóa đơn ${invoiceId} đã được đánh dấu Đã giao.`);
        onSuccess && onSuccess(); // Tải lại danh sách cha
        // loadDetail(invoiceId); // Tải lại chi tiết để cập nhật trạng thái trong modal
      } else {
        toast.error("Đánh dấu Đã giao thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error(`Lỗi: ${error || "Thao tác Đã giao thất bại."}`);
    }
  }, [invoiceId, currentInvoice, deliverInvoice, onSuccess, error]);

  // Hàm xử lý Hủy hóa đơn (Tùy chọn)
  const handleCancel = useCallback(async () => {
    if (!invoiceId || !currentInvoice) return;

    try {
      const success = await cancelRedemption(invoiceId);
      if (success) {
        toast.success(`Hóa đơn ${invoiceId} đã được Hủy.`);
        onSuccess && onSuccess(); // Tải lại danh sách cha
      } else {
        toast.error("Hủy hóa đơn thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error(`Lỗi: ${error || "Thao tác Hủy thất bại."}`);
    }
  }, [invoiceId, currentInvoice, cancelRedemption, onSuccess, error]);

  // Render các nút hành động
  const renderActions = () => {
    if (!currentInvoice) return null;

    // Chỉ cho phép hành động nếu hóa đơn đang ở trạng thái PENDING
    const isPending = currentInvoice.status === "PENDING";
    const isWorking = saving; // Saving là trạng thái chung cho tất cả thao tác ghi

    return (
      <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
        {isPending && (
          // Nút Hủy
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isWorking}
          >
            {isWorking ? (
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            Hủy Hóa đơn
          </Button>
        )}

        {isPending && (
          // Nút Đánh dấu Đã giao
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleDeliver}
            disabled={isWorking}
          >
            {isWorking ? (
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckSquare className="h-4 w-4 mr-2" />
            )}
            Đánh dấu Đã giao
          </Button>
        )}

        {/* Nút Đóng (luôn hiển thị) */}
        <Button variant="outline" onClick={onClose} disabled={isWorking}>
          Đóng
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chi tiết Hóa đơn Redeem: #{invoiceId}
          </DialogTitle>
        </DialogHeader>

        {loadingDetail || !currentInvoice ? (
          <p className="text-center py-10">Đang tải chi tiết hóa đơn...</p>
        ) : (
          <div className="space-y-4">
            {/* 🌟 Hiển thị trạng thái */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
              <span className="text-gray-600 font-medium">
                Trạng thái hiện tại:
              </span>
              <span
                className={`text-lg font-bold ${
                  currentInvoice.status === "PENDING"
                    ? "text-yellow-600"
                    : currentInvoice.status === "DELIVERED"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {currentInvoice.status}
              </span>
            </div>

            {/* 🌟 Form hiển thị chi tiết (Chỉ đọc) */}
            <InvoiceDetailForm invoice={currentInvoice} />

            {/* 🌟 Khu vực nút Hành động */}
            {renderActions()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
