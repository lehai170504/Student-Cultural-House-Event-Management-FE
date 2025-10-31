"use client";

import { useEffect, useState } from "react";
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

interface ViewDetailEventProps {
  eventId: number | null;
  open: boolean;
  onClose: () => void;
}

export default function ViewDetailEvent({
  eventId,
  open,
  onClose,
}: ViewDetailEventProps) {
  const {
    detail,
    loadingDetail,
    loadDetail,
    eventCategories,
    loadingCategories,
  } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const [pointCostToRegister, setPointCostToRegister] = useState("0");
  const [totalRewardPoints, setTotalRewardPoints] = useState("0");
  const [totalBudgetCoin, setTotalBudgetCoin] = useState("0");

  // Load chi tiết khi eventId thay đổi
  useEffect(() => {
    if (open && eventId) {
      loadDetail(eventId);
    }
  }, [eventId, open, loadDetail]);

  // Khi detail load xong
  useEffect(() => {
    if (detail && detail.id === eventId) {
      setTitle(detail.title);
      setDescription(detail.description);
      setLocation(detail.location);

      // Format ngày giờ thành "yyyy-MM-dd HH:mm"
      const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      setStartTime(formatDate(detail.startTime));
      setEndTime(formatDate(detail.endTime));

      setCategoryId(detail.category.id);

      setPointCostToRegister(detail.pointCostToRegister.toString());
      setTotalRewardPoints(detail.totalRewardPoints.toString());
      setTotalBudgetCoin(detail.totalBudgetCoin.toString());
    }
  }, [detail, eventId]);

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
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên sự kiện
              </label>
              <Input
                value={title}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <Input
                value={description}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Địa điểm
              </label>
              <Input
                value={location}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Thời gian bắt đầu
                </label>
                <Input
                  value={startTime}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Thời gian kết thúc
                </label>
                <Input
                  value={endTime}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Danh mục sự kiện
              </label>
              <Select
                value={categoryId !== null ? categoryId.toString() : undefined}
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
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Điểm đăng ký
              </label>
              <Input
                value={pointCostToRegister}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tổng điểm thưởng
              </label>
              <Input
                value={totalRewardPoints}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tổng ngân sách coin
              </label>
              <Input
                value={totalBudgetCoin}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
