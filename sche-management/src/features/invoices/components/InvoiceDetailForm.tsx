"use client";

import React from "react";

interface InvoiceDetailFormProps {
  invoice: {
    studentName: string;
    productTitle: string;
    quantity: number;
    totalCost: number;
    currency: string;
    createdAt: string | null;
    status: string;
  };
}

export default function InvoiceDetailForm({ invoice }: InvoiceDetailFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Tên Sinh viên:</span>
        <span className="font-semibold">{invoice.studentName}</span>
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Sản phẩm:</span>
        <span className="font-semibold">{invoice.productTitle}</span>
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Số lượng:</span>
        <span className="font-semibold">{invoice.quantity}</span>
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Tổng phí:</span>
        <span className="font-semibold">
          {invoice.totalCost.toLocaleString()} {invoice.currency}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Ngày tạo:</span>
        <span className="font-semibold">
          {invoice.createdAt
            ? new Date(invoice.createdAt).toLocaleDateString()
            : "-"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Trạng thái:</span>
        <span
          className={`font-bold ${
            invoice.status === "PENDING"
              ? "text-yellow-600"
              : invoice.status === "DELIVERED"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {invoice.status}
        </span>
      </div>
    </div>
  );
}
