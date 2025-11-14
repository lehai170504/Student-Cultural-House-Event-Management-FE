"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Star,
} from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import { useInvoices } from "@/features/invoices/hooks/useInvoices";
import { studentService } from "@/features/students/services/studentService";
import InvoiceService from "@/features/invoices/services/invoiceService";
import type { Invoice, TopProduct } from "@/features/invoices/types/invoice";

export default function GiftHistoryPage() {
  const { studentHistory, loadingHistory, error, loadStudentHistory } =
    useInvoices();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);

  // Load student ID from /me API and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await studentService.getProfile();
        if (profile?.id) {
          const id = String(profile.id);
          setStudentId(id);
          await loadStudentHistory(id);
        }

        // Load stats
        setLoadingStats(true);
        try {
          const stats = await InvoiceService.getRedeemStats();
          setTopProducts(stats.topProducts || []);
        } catch (statsError) {
          console.error("Error loading stats:", statsError);
        } finally {
          setLoadingStats(false);
        }
      } catch (error) {
        console.error("Error loading student ID:", error);
      }
    };
    loadData();
  }, [loadStudentHistory]);

  // Sort invoices by createdAt (newest first)
  const sortedInvoices = useMemo(() => {
    return [...studentHistory].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Newest first
    });
  }, [studentHistory]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <Badge className="bg-green-500 text-white flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Đã giao
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-500 text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Đang chờ
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-500 text-white flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Đã hủy
          </Badge>
        );
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-orange-500" />
            Lịch sử đổi thưởng
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Xem lại các quà tặng bạn đã đổi
          </p>
        </div>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <span className="ml-2 text-sm text-gray-600">
              Đang tải lịch sử...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p className="mb-3 text-sm">{error}</p>
            <Button
              onClick={() => studentId && loadStudentHistory(studentId)}
              variant="outline"
              size="sm"
            >
              Thử lại
            </Button>
          </div>
        ) : sortedInvoices.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Bạn chưa có lịch sử đổi thưởng nào</p>
            <Button
              className="mt-3"
              size="sm"
              onClick={() => (window.location.href = "/gifts")}
            >
              Đổi quà ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Products Section */}
            {topProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Sản phẩm đổi nhiều nhất
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {topProducts.map((product, index) => (
                    <div
                      key={product.productId}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {index < 3 && (
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          )}
                          <span className="text-sm font-semibold text-gray-900">
                            {product.title}
                          </span>
                        </div>
                        <Badge className="bg-orange-500 text-white text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Số lần đổi:</span>
                          <span className="font-semibold">
                            {product.totalRedeem}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tổng điểm:</span>
                          <span className="font-semibold text-orange-600">
                            {product.totalCoins.toLocaleString("vi-VN")} COIN
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Tổng điểm
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Mã xác nhận
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ngày đổi
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ngày giao
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedInvoices.map((invoice) => (
                      <tr
                        key={invoice.invoiceId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.productTitle}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge className="bg-blue-500 text-white text-xs">
                            {invoice.productType}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {invoice.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-semibold text-orange-600">
                            {invoice.totalCost.toLocaleString("vi-VN")}{" "}
                            {invoice.currency}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {invoice.verificationCode ? (
                            <span className="text-sm font-mono text-gray-600">
                              {invoice.verificationCode}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {invoice.createdAt
                            ? formatDate(invoice.createdAt)
                            : "Chưa cập nhật"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {invoice.deliveredAt ? (
                            <div>
                              <div className="text-gray-900 font-medium">
                                {formatDate(invoice.deliveredAt)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
