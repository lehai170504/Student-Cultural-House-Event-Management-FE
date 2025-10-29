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
import { Bell, Users, CalendarPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateNotification from "@/components/admin/nottifications/CreateNotification";

type Notification = {
  id: number;
  title: string;
  target: string;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fake data, thực tế sẽ gọi API
    setNotifications([
      {
        id: 1,
        title: "Thông báo nghỉ lễ 2/9",
        target: "Tất cả sinh viên",
        createdAt: "2025-09-01 08:00",
      },
      {
        id: 2,
        title: "Hạn nộp báo cáo tháng 9",
        target: "Phòng Công tác Sinh viên",
        createdAt: "2025-09-05 14:30",
      },
    ]);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-600">Thông báo</h1>
        <Button
          onClick={() => setOpen(true)}
          variant="default"
          className="bg-blue-500"
        >
          <Plus className="w-4 h-4" />
          Thêm thông báo
        </Button>
      </div>
      <p className="text-gray-600">
        Quản lý và theo dõi các{" "}
        <span className="font-semibold">thông báo hệ thống</span>
      </p>

      <Card className="border-blue-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Danh sách thông báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption className="text-gray-500 italic">
              Hiển thị tối đa 50 thông báo gần nhất
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="font-semibold">Tiêu đề</TableHead>
                <TableHead className="font-semibold">Người nhận</TableHead>
                <TableHead className="font-semibold">Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((n) => (
                <TableRow
                  key={n.id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  {/* Tiêu đề */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-500" />
                      {n.title}
                    </div>
                  </TableCell>

                  {/* Target */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <Badge className="bg-blue-100 text-blue-700">
                        {n.target}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Thời gian */}
                  <TableCell className="text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarPlus className="w-4 h-4" />
                      {n.createdAt}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateNotification
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(data) =>
          setNotifications((prev) => [
            { id: prev.length + 1, ...data },
            ...prev,
          ])
        }
      />
    </div>
  );
}
