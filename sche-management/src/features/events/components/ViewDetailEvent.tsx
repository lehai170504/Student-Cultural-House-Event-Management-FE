"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEvents } from "../hooks/useEvents";
import { Button } from "@/components/ui/button";
import { useUserProfileAuth } from "@/hooks/useUserProfileAuth";
import { toast } from "sonner";

interface ViewDetailEventProps {
  eventId: string | null;
  open: boolean;
  onClose: () => void;
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

const toLocalDatetimeValue = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localISO = new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
  return localISO;
};

export default function ViewDetailEvent({
  eventId,
  open,
  onClose,
}: ViewDetailEventProps) {
  const { user: authUser, isAdmin, isManager } = useUserProfileAuth();
  const isPartner = authUser?.groups.includes("PARTNERS") || false;

  const {
    detail,
    loadingDetail,
    loadDetail,
    eventCategories,
    loadingCategories,
    updateExistingEvent,
    loadCategories,
  } = useEvents();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    categoryId: "",
    pointCostToRegister: "0",
    totalRewardPoints: "0",
    totalBudgetCoin: "0",
  });

  const [startDateTimeInput, setStartDateTimeInput] = useState("");
  const [endDateTimeInput, setEndDateTimeInput] = useState("");

  // Load chi tiết khi eventId thay đổi
  useEffect(() => {
    if (open && eventId) {
      loadDetail(eventId);
      loadCategories().catch(console.error);
    }
  }, [eventId, open, loadDetail, loadCategories]);

  // Khi detail load xong
  useEffect(() => {
    if (detail && detail.id === eventId) {
      setForm({
        title: detail.title,
        description: detail.description,
        location: detail.location,
        startTime: detail.startTime,
        endTime: detail.endTime,
        categoryId: String(detail.category?.id ?? ""),
        pointCostToRegister: detail.pointCostToRegister.toString(),
        totalRewardPoints: detail.totalRewardPoints.toString(),
        totalBudgetCoin: detail.totalBudgetCoin.toString(),
      });

      setStartDateTimeInput(toLocalDatetimeValue(detail.startTime));
      setEndDateTimeInput(toLocalDatetimeValue(detail.endTime));
    }
  }, [detail, eventId]);

  const isPartnerCategoryDisabled = useMemo(
    () => !isPartner || loadingCategories,
    [isPartner, loadingCategories]
  );

  const setField = (
    key:
      | "title"
      | "description"
      | "location"
      | "categoryId"
      | "pointCostToRegister"
      | "totalRewardPoints"
      | "totalBudgetCoin"
  ) => {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };
  };

  const handleStartDateTimeChange = (value: string) => {
    setStartDateTimeInput(value);
    if (!value) {
      setForm((prev) => ({ ...prev, startTime: "" }));
      return;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return;
    setForm((prev) => ({
      ...prev,
      startTime: toISOStringWithTimezone(parsed),
    }));
  };

  const handleEndDateTimeChange = (value: string) => {
    setEndDateTimeInput(value);
    if (!value) {
      setForm((prev) => ({ ...prev, endTime: "" }));
      return;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return;
    setForm((prev) => ({
      ...prev,
      endTime: toISOStringWithTimezone(parsed),
    }));
  };

  const handleUpdate = async () => {
    if (!eventId) return;
    if (!form.title || !form.startTime || !form.endTime || !form.location) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    try {
      await updateExistingEvent(eventId, {
        title: form.title,
        description: form.description,
        location: form.location,
        startTime: form.startTime,
        endTime: form.endTime,
        categoryId: form.categoryId,
        pointCostToRegister: Number(form.pointCostToRegister),
        totalRewardPoints: Number(form.totalRewardPoints),
        totalBudgetCoin: Number(form.totalBudgetCoin),
      });
      toast.success("Cập nhật sự kiện thành công!");
      onClose();
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Chi tiết sự kiện
          </DialogTitle>
        </DialogHeader>

        {loadingDetail || !detail ? (
          <p className="text-center py-10">Đang tải chi tiết...</p>
        ) : (
          <div className="space-y-4 mt-4">
            {/** Tên sự kiện */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên sự kiện
              </label>
              <Input
                value={form.title}
                onChange={(e) => isPartner && setField("title")(e.target.value)}
                readOnly={!isPartner}
                className={`bg-gray-100 ${!isPartner ? "cursor-not-allowed" : ""}`}
              />
            </div>

            {/** Mô tả */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <Input
                value={form.description}
                onChange={(e) =>
                  isPartner && setField("description")(e.target.value)
                }
                readOnly={!isPartner}
                className={`bg-gray-100 ${!isPartner ? "cursor-not-allowed" : ""}`}
              />
            </div>

            {/** Địa điểm */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Địa điểm
              </label>
              <Input
                value={form.location}
                onChange={(e) =>
                  isPartner && setField("location")(e.target.value)
                }
                readOnly={!isPartner}
                className={`bg-gray-100 ${!isPartner ? "cursor-not-allowed" : ""}`}
              />
            </div>

            {/** Thời gian */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Thời gian bắt đầu
                </label>
                <Input
                  type="datetime-local"
                  value={startDateTimeInput}
                  onChange={(e) =>
                    isPartner && handleStartDateTimeChange(e.target.value)
                  }
                  readOnly={!isPartner}
                  className={`bg-gray-100 ${!isPartner ? "cursor-not-allowed" : ""}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Thời gian kết thúc
                </label>
                <Input
                  type="datetime-local"
                  value={endDateTimeInput}
                  onChange={(e) =>
                    isPartner && handleEndDateTimeChange(e.target.value)
                  }
                  readOnly={!isPartner}
                  className={`bg-gray-100 ${!isPartner ? "cursor-not-allowed" : ""}`}
                />
              </div>
            </div>

            {/** Danh mục */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Danh mục sự kiện
              </label>
              <Select
                value={form.categoryId || undefined}
                onValueChange={(v) => isPartner && setField("categoryId")(v)}
                disabled={isPartnerCategoryDisabled}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingCategories ? "Đang tải..." : "Chọn danh mục"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/** Điểm đăng ký, tổng điểm thưởng, ngân sách */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Điểm đăng ký
              </label>
              <Input
                value={form.pointCostToRegister}
                onChange={(e) =>
                  isPartner && setField("pointCostToRegister")(e.target.value)
                }
                readOnly={!isPartner}
                className={`bg-gray-100 ${!isPartner ? "cursor-not-allowed" : ""}`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tổng điểm thưởng
              </label>
              <Input
                value={form.totalRewardPoints}
                onChange={(e) =>
                  isPartner && setField("totalRewardPoints")(e.target.value)
                }
                readOnly={!isPartner}
                className={`bg-gray-100 ${!isPartner ? "cursor-not-allowed" : ""}`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tổng ngân sách coin
              </label>
              <Input
                value={form.totalBudgetCoin}
                onChange={(e) =>
                  isPartner && setField("totalBudgetCoin")(e.target.value)
                }
                readOnly={!isPartner}
                className={`bg-gray-100 ${!isPartner ? "cursor-not-allowed" : ""}`}
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          {isPartner && <Button onClick={handleUpdate}>Cập nhật</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
