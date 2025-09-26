"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";

interface EventItem {
  id: number;
  name: string;
  organizer: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

interface ViewOrEditEventProps {
  event: EventItem | null;
  onClose: () => void;
  onUpdate: (event: EventItem) => void;
}

export default function ViewOrEditEvent({
  event,
  onClose,
  onUpdate,
}: ViewOrEditEventProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EventItem | null>(event);

  useEffect(() => {
    setForm(event);
    setIsEditing(false);
  }, [event]);

  if (!event) return null;

  const handleSave = () => {
    if (form) {
      onUpdate(form);
      setIsEditing(false);
    }
  };

  const statusColors: Record<EventItem["status"], string> = {
    pending: "bg-yellow-100 text-yellow-600",
    approved: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? "Chỉnh sửa sự kiện" : "Chi tiết sự kiện"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={form?.name || ""}
                onChange={(e) =>
                  setForm((f) => f && { ...f, name: e.target.value })
                }
                placeholder="Tên sự kiện"
              />
              <Input
                value={form?.organizer || ""}
                onChange={(e) =>
                  setForm((f) => f && { ...f, organizer: e.target.value })
                }
                placeholder="Ban tổ chức"
              />
              <Input
                type="date"
                value={form?.date || ""}
                onChange={(e) =>
                  setForm((f) => f && { ...f, date: e.target.value })
                }
              />
              <Button onClick={handleSave} className="bg-green-500 w-full">
                <Save className="h-4 w-4 mr-2" /> Lưu
              </Button>
            </div>
          ) : (
            <div className="space-y-4 rounded-md border p-4 bg-gray-50">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-gray-600">Tên:</span>
                <span className="col-span-2">{event.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-gray-600">Ban tổ chức:</span>
                <span className="col-span-2">{event.organizer}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-gray-600">Ngày:</span>
                <span className="col-span-2">{event.date}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="font-medium text-gray-600">Trạng thái:</span>
                <span
                  className={`col-span-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[event.status]
                  }`}
                >
                  {event.status === "pending"
                    ? "Chờ duyệt"
                    : event.status === "approved"
                    ? "Đã duyệt"
                    : "Bị từ chối"}
                </span>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex justify-end mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" /> Sửa
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
