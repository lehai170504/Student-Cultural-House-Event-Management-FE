"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

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

/**
 * Convert Date to ISO string with timezone offset +07:00 (Vietnam timezone)
 */
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

interface Category {
  id: string | number;
  name: string;
}

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // gọi lại khi tạo thành công
}

export default function CreateEventModal({
  open,
  onClose,
  onSuccess,
}: CreateEventModalProps) {
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    categoryId: "",
    pointCostToRegister: "",
    totalRewardPoints: "",
    totalBudgetCoin: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState<string>("");

  // 🌀 Tải danh mục sự kiện khi mở modal
  useEffect(() => {
    if (open) {
      const fetchCats = async () => {
        try {
          setLoadingCats(true);
          const res = await fetch("/api/event-categories"); // hoặc API bạn đang dùng
          const data = await res.json();
          setCategories(data);
        } catch (err) {
          console.error("Lỗi tải danh mục:", err);
        } finally {
          setLoadingCats(false);
        }
      };
      fetchCats();
    }
  }, [open]);

  // Reset form khi đóng modal
  useEffect(() => {
    if (!open) {
      setForm({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        categoryId: "",
        pointCostToRegister: "",
        totalRewardPoints: "",
        totalBudgetCoin: "",
      });
      setStartDate(undefined);
      setStartTime("");
      setEndDate(undefined);
      setEndTime("");
    }
  }, [open]);

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f: any) => ({ ...f, [k]: e.target.value }));

  // ====== Date/Time handlers ======
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && startTime) {
      const [h, m] = startTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(h), parseInt(m), 0, 0);
      setForm((f: any) => ({
        ...f,
        startTime: toISOStringWithTimezone(combined),
      }));
    } else setForm((f: any) => ({ ...f, startTime: "" }));
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (startDate && time) {
      const [h, m] = time.split(":");
      const combined = new Date(startDate);
      combined.setHours(parseInt(h), parseInt(m), 0, 0);
      setForm((f: any) => ({
        ...f,
        startTime: toISOStringWithTimezone(combined),
      }));
    } else setForm((f: any) => ({ ...f, startTime: "" }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && endTime) {
      const [h, m] = endTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(h), parseInt(m), 0, 0);
      setForm((f: any) => ({
        ...f,
        endTime: toISOStringWithTimezone(combined),
      }));
    } else setForm((f: any) => ({ ...f, endTime: "" }));
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    if (endDate && time) {
      const [h, m] = time.split(":");
      const combined = new Date(endDate);
      combined.setHours(parseInt(h), parseInt(m), 0, 0);
      setForm((f: any) => ({
        ...f,
        endTime: toISOStringWithTimezone(combined),
      }));
    } else setForm((f: any) => ({ ...f, endTime: "" }));
  };

  // ====== Submit ======
  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.startTime ||
      !form.endTime ||
      !form.location ||
      !form.categoryId
    ) {
      Swal.fire(
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ các trường bắt buộc.",
        "warning"
      );
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Tạo sự kiện thất bại");

      Swal.fire("Thành công", "Sự kiện đã được tạo!", "success");
      onSuccess(); // callback reload danh sách
      onClose();
    } catch (err) {
      Swal.fire("Lỗi", "Không thể tạo sự kiện.", "error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Tạo sự kiện mới 🚀
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
                value={startTime}
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
                value={endTime}
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
            value={form.categoryId ? String(form.categoryId) : ""}
            onValueChange={(val) =>
              setForm((f: any) => ({ ...f, categoryId: val }))
            }
            disabled={loadingCats}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={loadingCats ? "Đang tải..." : "Chọn danh mục (*)"}
              />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <SelectItem value="" disabled>
                  {loadingCats ? "Đang tải..." : "Không có danh mục"}
                </SelectItem>
              ) : (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Input
            placeholder="Điểm phí đăng ký (Mặc định: 0)"
            type="number"
            value={form.pointCostToRegister}
            onChange={setField("pointCostToRegister")}
          />
          <Input
            placeholder="Tổng điểm thưởng (Mặc định: 0)"
            type="number"
            value={form.totalRewardPoints}
            onChange={setField("totalRewardPoints")}
          />
          <Input
            placeholder="Tổng ngân sách (coin) (Mặc định: 0)"
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
