"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
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
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+07:00`;
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

  const [startDate, setStartDate] = useState<Date>();
  const [startTimeStr, setStartTimeStr] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>();
  const [endTimeStr, setEndTimeStr] = useState<string>("");

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
      setStartDate(undefined);
      setStartTimeStr("");
      setEndDate(undefined);
      setEndTimeStr("");
    }
  }, [open, partnerId]);

  const setField =
    (k: keyof CreateEvent) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;
      setForm((f) => ({ ...f, [k]: value }));
    };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && startTimeStr) {
      const [h, m] = startTimeStr.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(h), parseInt(m), 0, 0);
      setForm((f) => ({ ...f, startTime: toISOStringWithTimezone(combined) }));
    } else setForm((f) => ({ ...f, startTime: "" }));
  };

  const handleStartTimeChange = (time: string) => {
    setStartTimeStr(time);
    if (startDate && time) {
      const [h, m] = time.split(":");
      const combined = new Date(startDate);
      combined.setHours(parseInt(h), parseInt(m), 0, 0);
      setForm((f) => ({ ...f, startTime: toISOStringWithTimezone(combined) }));
    } else setForm((f) => ({ ...f, startTime: "" }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && endTimeStr) {
      const [h, m] = endTimeStr.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(h), parseInt(m), 0, 0);
      setForm((f) => ({ ...f, endTime: toISOStringWithTimezone(combined) }));
    } else setForm((f) => ({ ...f, endTime: "" }));
  };

  const handleEndTimeChange = (time: string) => {
    setEndTimeStr(time);
    if (endDate && time) {
      const [h, m] = time.split(":");
      const combined = new Date(endDate);
      combined.setHours(parseInt(h), parseInt(m), 0, 0);
      setForm((f) => ({ ...f, endTime: toISOStringWithTimezone(combined) }));
    } else setForm((f) => ({ ...f, endTime: "" }));
  };

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
          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate
                    ? format(startDate, "dd/MM/yyyy")
                    : "Chọn ngày bắt đầu (*)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Input
                type="time"
                value={startTimeStr}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />
              <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Ngày kết thúc & giờ */}
          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate
                    ? format(endDate, "dd/MM/yyyy")
                    : "Chọn ngày kết thúc (*)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Input
                type="time"
                value={endTimeStr}
                onChange={(e) => handleEndTimeChange(e.target.value)}
              />
              <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
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
