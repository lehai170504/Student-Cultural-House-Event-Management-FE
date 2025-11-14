"use client";

import { useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCw, CheckSquare, XCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useInvoices } from "../hooks/useInvoices";
import InvoiceDetailForm from "./InvoiceDetailForm";

interface ViewDetailInvoiceProps {
  invoiceId: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  index?: number;
}

export default function ViewDetailInvoice({
  invoiceId,
  open,
  onClose,
  onSuccess,
  index,
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

  useEffect(() => {
    if (open && invoiceId) {
      loadDetail(invoiceId);
      clearInvoiceError();
    }
  }, [invoiceId, open, loadDetail, clearInvoiceError]);

  const currentInvoice = useMemo(
    () => (detail?.invoiceId === invoiceId ? detail : null),
    [detail, invoiceId]
  );

  const handleDeliver = useCallback(async () => {
    if (!invoiceId || !currentInvoice) return;
    try {
      const success = await deliverInvoice(invoiceId);
      if (success) {
        toast.success("Hóa đơn đã được đánh dấu Đã giao.");
        onSuccess?.();
      } else toast.error("Đánh dấu Đã giao thất bại!");
    } catch {
      toast.error(error || "Thao tác Đã giao thất bại.");
    }
  }, [invoiceId, currentInvoice, deliverInvoice, onSuccess, error]);

  const handleCancel = useCallback(async () => {
    if (!invoiceId || !currentInvoice) return;
    try {
      const success = await cancelRedemption(invoiceId);
      if (success) {
        toast.success("Hóa đơn đã được Hủy.");
        onSuccess?.();
      } else toast.error("Hủy hóa đơn thất bại!");
    } catch {
      toast.error(error || "Thao tác Hủy thất bại.");
    }
  }, [invoiceId, currentInvoice, cancelRedemption, onSuccess, error]);

  const renderActions = () => {
    if (!currentInvoice) return null;

    const isPending = currentInvoice.status === "PENDING";
    const isWorking = saving;

    return (
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t mt-4">
        {isPending && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isWorking}
            className="flex items-center justify-center gap-2"
          >
            {isWorking ? (
              <RotateCw className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Hủy Hóa đơn
          </Button>
        )}

        {isPending && (
          <Button
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            onClick={handleDeliver}
            disabled={isWorking}
          >
            {isWorking ? (
              <RotateCw className="h-4 w-4 animate-spin" />
            ) : (
              <CheckSquare className="h-4 w-4" />
            )}
            Đánh dấu Đã giao
          </Button>
        )}

        <Button
          variant="outline"
          onClick={onClose}
          disabled={isWorking}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Đóng
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center justify-between">
            <span>Chi tiết Hóa đơn Redeem</span>
            {typeof index === "number" && (
              <span className="text-sm text-gray-500">STT: {index}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {loadingDetail || !currentInvoice ? (
          <p className="text-center py-10 text-gray-500">
            Đang tải chi tiết hóa đơn...
          </p>
        ) : (
          <div className="space-y-6">
            {/* Form hiển thị chi tiết */}
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <InvoiceDetailForm invoice={currentInvoice} />
            </div>

            {/* Nút hành động */}
            {renderActions()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
