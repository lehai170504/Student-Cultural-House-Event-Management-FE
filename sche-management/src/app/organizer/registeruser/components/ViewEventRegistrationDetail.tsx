"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Registration {
  id: number;
  studentName: string;
  studentEmail: string;
  eventName: string;
  status: "registered" | "checked-in" | "cancelled";
}

interface Props {
  open: boolean;
  onClose: () => void;
  registration: Registration | undefined;
}

const statusLabels: Record<Registration["status"], string> = {
  registered: "Đã đăng ký",
  "checked-in": "Đã điểm danh",
  cancelled: "Đã hủy",
};

const statusColors: Record<Registration["status"], string> = {
  registered: "bg-blue-100 text-blue-800",
  "checked-in": "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function ViewEventRegistrationDetail({
  open,
  onClose,
  registration,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Chi tiết đăng ký
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Thông tin chi tiết của sinh viên đăng ký sự kiện
          </DialogDescription>
        </DialogHeader>

        {registration && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-600">Họ tên</span>
              <span className="text-gray-900">{registration.studentName}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-600">Email</span>
              <span className="text-gray-900">{registration.studentEmail}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium text-gray-600">Sự kiện</span>
              <span className="text-gray-900">{registration.eventName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Trạng thái</span>
              <Badge className={statusColors[registration.status]}>
                {statusLabels[registration.status]}
              </Badge>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
