"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Trash2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateOrEditVoucher from "@/components/admin/vouchers/CreateOrEditVoucher";
import ViewDetailVoucher from "@/components/admin/vouchers/ViewDetailVoucher";

type Voucher = {
  id: number;
  code: string;
  discount: string;
  expiredAt: string;
  status: "active" | "expired";
};

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    // Fake data
    setVouchers([
      {
        id: 1,
        code: "WELCOME50",
        discount: "50%",
        expiredAt: "2025-12-31",
        status: "active",
      },
      {
        id: 2,
        code: "SUMMER20",
        discount: "20%",
        expiredAt: "2025-08-01",
        status: "expired",
      },
    ]);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-600">
          Danh sách khuyến mãi
        </h1>
        <Button
          onClick={() => setOpen(true)}
          variant="default"
          className="bg-purple-500"
        >
          <Plus className="w-4 h-4" />
          Thêm khuyến mãi
        </Button>
      </div>
      <p className="text-gray-600">
        Quản lý và theo dõi các{" "}
        <span className="font-semibold">voucher khuyến mãi</span>.
      </p>

      {/* Danh sách voucher */}
      <Card className="border-purple-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Danh sách khuyến mãi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption className="text-gray-500 italic">
              Hiển thị tối đa 50 voucher gần nhất
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-purple-50">
                <TableHead className="font-semibold">Mã Voucher</TableHead>
                <TableHead className="font-semibold">Giảm giá</TableHead>
                <TableHead className="font-semibold">Hết hạn</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((v) => (
                <TableRow
                  key={v.id}
                  className="hover:bg-purple-50 transition-colors duration-200"
                >
                  {/* Mã voucher */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-500" />
                      {v.code}
                    </div>
                  </TableCell>

                  {/* Discount */}
                  <TableCell>{v.discount}</TableCell>

                  {/* ExpiredAt */}
                  <TableCell className="text-sm text-gray-500">
                    {v.expiredAt}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={
                        v.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }
                    >
                      {v.status === "active" ? "Đang hoạt động" : "Hết hạn"}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setSelectedVoucher(v)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal tạo voucher mới */}
      <CreateOrEditVoucher
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(voucher) =>
          setVouchers((prev) => [{ id: prev.length + 1, ...voucher }, ...prev])
        }
      />

      {/* Modal xem chi tiết voucher */}
      <ViewDetailVoucher
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
      />
    </div>
  );
}
