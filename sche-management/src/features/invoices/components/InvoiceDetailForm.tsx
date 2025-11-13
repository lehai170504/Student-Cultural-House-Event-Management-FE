// src/features/invoices/components/InvoiceDetailForm.tsx (Ví dụ đơn giản)
import { Invoice } from "../types/invoice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InvoiceDetailFormProps {
  invoice: Invoice;
}

export default function InvoiceDetailForm({ invoice }: InvoiceDetailFormProps) {
  const detailItems = [
    { label: "Mã Sinh viên", value: invoice.studentId },
    { label: "Tên Sinh viên", value: invoice.studentName },
    { label: "Sản phẩm", value: invoice.productTitle },
    { label: "Loại sản phẩm", value: invoice.productType },
    { label: "Số lượng", value: invoice.quantity },
    {
      label: "Tổng phí",
      value: `${invoice.totalCost.toLocaleString()} ${invoice.currency}`,
    },
    { label: "Mã xác nhận", value: invoice.verificationCode },
    {
      label: "Thời gian tạo",
      value: new Date(invoice.createdAt).toLocaleString(),
    },
    { label: "Người giao", value: invoice.deliveredBy || "Chưa có" },
    {
      label: "Thời gian giao",
      value: invoice.deliveredAt
        ? new Date(invoice.deliveredAt).toLocaleString()
        : "Chưa giao",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {detailItems.map((item, index) => (
        <div key={index} className="space-y-1">
          <Label className="text-sm font-medium text-gray-600">
            {item.label}
          </Label>
          <Input
            value={item.value}
            readOnly
            className="bg-gray-100 border-gray-200 text-gray-800"
          />
        </div>
      ))}
    </div>
  );
}
