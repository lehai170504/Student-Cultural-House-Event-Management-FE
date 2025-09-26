"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

const statusLabels = {
  registered: "Đã đăng ký",
  "checked-in": "Đã điểm danh",
  cancelled: "Đã hủy",
};

export default function ViewEventRegistrationDetail({
  open,
  onClose,
  registration,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết đăng ký</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết của sinh viên đăng ký sự kiện
          </DialogDescription>
        </DialogHeader>

        {registration && (
          <div className="space-y-3 mt-4 text-gray-700">
            <p>
              <strong>Họ tên:</strong> {registration.studentName}
            </p>
            <p>
              <strong>Email:</strong> {registration.studentEmail}
            </p>
            <p>
              <strong>Sự kiện:</strong> {registration.eventName}
            </p>
            <p>
              <strong>Trạng thái:</strong> {statusLabels[registration.status]}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
