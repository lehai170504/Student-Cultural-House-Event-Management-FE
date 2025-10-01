"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, CheckCircle2, Clock } from "lucide-react";

interface EventItem {
  id: number;
  name: string;
  organizer: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

interface ViewDetailEventProps {
  event: EventItem | null;
  onClose: () => void;
}

const statusColors: Record<
  EventItem["status"],
  { label: string; className: string }
> = {
  pending: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Đã duyệt", className: "bg-green-100 text-green-700" },
  rejected: { label: "Bị từ chối", className: "bg-red-100 text-red-700" },
};

const phaseColors: Record<string, { label: string; className: string }> = {
  upcoming: { label: "Sắp diễn ra", className: "bg-blue-100 text-blue-700" },
  ongoing: { label: "Đang diễn ra", className: "bg-green-100 text-green-700" },
  past: { label: "Đã kết thúc", className: "bg-gray-100 text-gray-700" },
};

function parseDate(str: string) {
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function getEventPhase(dateStr: string) {
  const today = new Date();
  const eventDate = parseDate(dateStr);
  const start = new Date(eventDate);
  const end = new Date(eventDate);
  end.setDate(end.getDate() + 1);

  if (today < start) return "upcoming";
  if (today >= start && today < end) return "ongoing";
  return "past";
}

export default function ViewDetailEvent({
  event,
  onClose,
}: ViewDetailEventProps) {
  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chi tiết sự kiện
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết của sự kiện đã chọn
          </DialogDescription>
        </DialogHeader>

        {event && (
          <div className="space-y-4 mt-4">
            {/* Tên sự kiện */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{event.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                {event.organizer}
              </p>
            </div>

            {/* Ngày diễn ra */}
            <div className="flex items-center gap-2 text-gray-700">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <span>{event.date}</span>
            </div>

            {/* Trạng thái duyệt */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gray-500" />
              <Badge
                variant="outline"
                className={statusColors[event.status].className}
              >
                {statusColors[event.status].label}
              </Badge>
            </div>

            {/* Tình trạng diễn ra */}
            {event.status === "approved" && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <Badge
                  variant="outline"
                  className={phaseColors[getEventPhase(event.date)].className}
                >
                  {phaseColors[getEventPhase(event.date)].label}
                </Badge>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
