// src/pages/RedemptionInvoicePage.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const RedemptionInvoiceTable = dynamic(
  () => import("@/features/invoices/components/RedemptionInvoiceTable"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Đang tải giao diện quản lý hóa đơn...</p>
      </div>
    ),
  }
);

export default function RedemptionInvoicePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Suspense
        fallback={<p className="text-center py-10">Đang khởi tạo...</p>}
      >
        <RedemptionInvoiceTable />
      </Suspense>
    </div>
  );
}
