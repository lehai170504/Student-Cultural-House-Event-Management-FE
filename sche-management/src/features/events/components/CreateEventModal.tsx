"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreateEvent } from "../types/events";
import { useEvents } from "../hooks/useEvents";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partnerId: string;
}

function toISOStringWithTimezone(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  const offsetMinutes = date.getTimezoneOffset();
  const offsetSign = offsetMinutes > 0 ? "-" : "+";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const offsetMins = String(absOffset % 60).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMins}`;
}

export default function CreateEventModal({
  open,
  onClose,
  onSuccess,
  partnerId,
}: CreateEventModalProps) {
  const {
    createNewEvent,
    eventCategories,
    loadingCategories,
    saving,
    loadCategories,
  } = useEvents();

  const [form, setForm] = useState<CreateEvent>({
    partnerId: partnerId || "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    categoryId: "",
    pointCostToRegister: 0,
    totalRewardPoints: 0,
    totalBudgetCoin: 0,
  });

  const [startInput, setStartInput] = useState<string>("");
  const [endInput, setEndInput] = useState<string>("");

  // Load categories khi mở modal
  useEffect(() => {
    if (open) loadCategories().catch(console.error);
  }, [open, loadCategories]);

  // Cập nhật partnerId khi prop thay đổi
  useEffect(() => {
    setForm((f) => ({ ...f, partnerId: partnerId || "" }));
  }, [partnerId]);

  // Reset form khi modal đóng
  useEffect(() => {
    if (!open) {
      setForm({
        partnerId: partnerId || "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        categoryId: "",
        pointCostToRegister: 0,
        totalRewardPoints: 0,
        totalBudgetCoin: 0,
      });
      setStartInput("");
      setEndInput("");
    }
  }, [open, partnerId]);

  const setField =
    (k: keyof CreateEvent) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;
      setForm((f) => ({ ...f, [k]: value }));
    };

  const handleDateTimeChange = (
    value: string,
    type: "start" | "end"
  ) => {
    if (type === "start") {
      setStartInput(value);
    } else {
      setEndInput(value);
    }

    if (!value) {
      setForm((f) => ({ ...f, [type === "start" ? "startTime" : "endTime"]: "" }));
      return;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return;

    setForm((f) => ({
      ...f,
      [type === "start" ? "startTime" : "endTime"]: toISOStringWithTimezone(parsed),
    }));

    if (type === "start" && (!endInput || new Date(endInput) < parsed)) {
      const offset = parsed.getTimezoneOffset() * 60000;
      const normalized = new Date(parsed.getTime() - offset)
        .toISOString()
        .slice(0, 16);
      setEndInput(normalized);
      setForm((f) => ({ ...f, endTime: toISOStringWithTimezone(parsed) }));
    }
  };

  const startLabel = useMemo(() => {
    if (!startInput) return "Chưa chọn";
    const parsed = new Date(startInput);
    return Number.isNaN(parsed.getTime())
      ? "Chưa chọn"
      : parsed.toLocaleString("vi-VN");
  }, [startInput]);

  const endLabel = useMemo(() => {
    if (!endInput) return "Chưa chọn";
    const parsed = new Date(endInput);
    return Number.isNaN(parsed.getTime())
      ? "Chưa chọn"
      : parsed.toLocaleString("vi-VN");
  }, [endInput]);

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.startTime ||
      !form.endTime ||
      !form.location ||
      !form.categoryId
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    try {
      await createNewEvent({
        ...form,
        categoryId: String(form.categoryId),
      });
      toast.success("Sự kiện đã được tạo!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Không thể tạo sự kiện.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Tạo sự kiện mới
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Tiêu đề (*)"
            value={form.title}
            onChange={setField("title")}
          />
          <Input
            placeholder="Mô tả"
            value={form.description}
            onChange={setField("description")}
          />

          {/* Ngày bắt đầu & giờ */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              Thời gian bắt đầu <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={startInput}
              onChange={(e) => handleDateTimeChange(e.target.value, "start")}
              className="h-11"
            />
            <p className="text-xs text-gray-500">
              Đã chọn: <span className="font-medium">{startLabel}</span>
            </p>
          </div>

          {/* Ngày kết thúc & giờ */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              Thời gian kết thúc <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={endInput}
              min={startInput || undefined}
              onChange={(e) => handleDateTimeChange(e.target.value, "end")}
              className="h-11"
            />
            <p className="text-xs text-gray-500">
              Đã chọn: <span className="font-medium">{endLabel}</span>
            </p>
          </div>

          <Input
            placeholder="Địa điểm (*)"
            value={form.location}
            onChange={setField("location")}
          />

          <Select
            value={form.categoryId}
            onValueChange={(val) => setForm((f) => ({ ...f, categoryId: val }))}
            disabled={loadingCategories}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingCategories ? "Đang tải..." : "Chọn danh mục (*)"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {eventCategories.length === 0 ? (
                <SelectItem value="" disabled>
                  {loadingCategories ? "Đang tải..." : "Không có danh mục"}
                </SelectItem>
              ) : (
                eventCategories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Input
            placeholder="Điểm phí đăng ký"
            type="number"
            value={form.pointCostToRegister}
            onChange={setField("pointCostToRegister")}
          />
          <Input
            placeholder="Tổng điểm thưởng"
            type="number"
            value={form.totalRewardPoints}
            onChange={setField("totalRewardPoints")}
          />
          <Input
            placeholder="Tổng ngân sách (coin)"
            type="number"
            value={form.totalBudgetCoin}
            onChange={setField("totalBudgetCoin")}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            disabled={saving}
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              "Tạo sự kiện"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
