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
import { Clock, User, FilePenLine, Trash2, PlusCircle } from "lucide-react";

type AuditEntry = {
  id: number;
  user: string;
  action: "Tạo mới" | "Cập nhật" | "Xóa";
  target: string;
  timestamp: string;
};

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);

  useEffect(() => {
    // Fake data, thực tế gọi API
    setLogs([
      {
        id: 1,
        user: "Admin",
        action: "Cập nhật",
        target: "Chính sách sự kiện A",
        timestamp: "2025-09-25 09:30",
      },
      {
        id: 2,
        user: "User01",
        action: "Xóa",
        target: "Sự kiện Workshop",
        timestamp: "2025-09-25 10:00",
      },
      {
        id: 3,
        user: "Admin",
        action: "Tạo mới",
        target: "Chính sách Check-in",
        timestamp: "2025-09-25 11:15",
      },
    ]);
  }, []);

  const actionIcon = (action: AuditEntry["action"]) => {
    switch (action) {
      case "Tạo mới":
        return <PlusCircle className="w-4 h-4 text-green-600" />;
      case "Cập nhật":
        return <FilePenLine className="w-4 h-4 text-orange-600" />;
      case "Xóa":
        return <Trash2 className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const actionBadge = (action: AuditEntry["action"]) => {
    switch (action) {
      case "Tạo mới":
        return <Badge className="bg-green-100 text-green-700">Tạo mới</Badge>;
      case "Cập nhật":
        return (
          <Badge className="bg-orange-100 text-orange-700">Cập nhật</Badge>
        );
      case "Xóa":
        return <Badge className="bg-red-100 text-red-700">Xóa</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">
        Theo dõi và giám sát
      </h1>
      <p className="text-gray-600">
        Theo dõi lịch sử thay đổi{" "}
        <span className="font-semibold">chính sách</span> /{" "}
        <span className="font-semibold">sự kiện</span>
      </p>

      <Card className="border-orange-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Lịch sử các thay đổi gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption className="text-gray-500 italic">
              Hiển thị tối đa 50 bản ghi gần nhất
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead className="font-semibold">Người thao tác</TableHead>
                <TableHead className="font-semibold">Hành động</TableHead>
                <TableHead className="font-semibold">Đối tượng</TableHead>
                <TableHead className="font-semibold">Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-orange-50 transition-colors duration-200"
                >
                  {/* Người thao tác */}
                  <TableCell className="flex items-center gap-2 font-medium">
                    <User className="w-4 h-4 text-gray-500" />
                    {log.user}
                  </TableCell>

                  {/* Hành động */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {actionIcon(log.action)}
                      {actionBadge(log.action)}
                    </div>
                  </TableCell>

                  {/* Đối tượng */}
                  <TableCell>{log.target}</TableCell>

                  {/* Thời gian */}
                  <TableCell className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {log.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
