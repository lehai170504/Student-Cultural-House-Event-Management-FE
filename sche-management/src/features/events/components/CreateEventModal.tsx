"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "../hooks/useEvents";
import { showToast } from "@/components/ui/Toast";
import type { CreateEvent } from "../types/events";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateEventModal({
  open,
  onClose,
}: CreateEventModalProps) {
  const { createNewEvent, saving, eventCategories, loadingCategories } =
    useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [rewardPerCheckin, setRewardPerCheckin] = useState(0);
  const [totalBudgetCoin, setTotalBudgetCoin] = useState(0);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setLocation("");
      setStartTime("");
      setEndTime("");
      setCategoryId(null);
      setRewardPerCheckin(0);
      setTotalBudgetCoin(0);
    }
  }, [open]);

  const handleSave = async () => {
    if (!title.trim()) {
      showToast({ title: "Tên sự kiện không được để trống", icon: "warning" });
      return;
    }
    if (!categoryId) {
      showToast({ title: "Chọn danh mục sự kiện", icon: "warning" });
      return;
    }

    const data: CreateEvent = {
      title,
      description,
      location,
      startTime,
      endTime,
      categoryId,
      rewardPerCheckin,
      totalBudgetCoin,
      partnerId: 0,
    };

    try {
      await createNewEvent(data);
      showToast({ title: "Tạo sự kiện thành công", icon: "success" });
      onClose();
    } catch (err) {
      showToast({ title: "Lỗi khi tạo sự kiện", icon: "error" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Tạo mới sự kiện
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Tên */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tên sự kiện
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên sự kiện"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mô tả
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả (tùy chọn)"
            />
          </div>

          {/* Địa điểm */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Địa điểm
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Nhập địa điểm"
            />
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Thời gian bắt đầu
              </label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Thời gian kết thúc
              </label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Danh mục sự kiện */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Danh mục sự kiện
            </label>
            <Select
              value={categoryId !== null ? categoryId.toString() : undefined}
              onValueChange={(value) => setCategoryId(Number(value))}
              disabled={loadingCategories} 
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

          {/* Reward per check-in */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Reward per check-in
            </label>
            <Input
              type="number"
              value={rewardPerCheckin}
              onChange={(e) => setRewardPerCheckin(Number(e.target.value))}
            />
          </div>

          {/* Tổng ngân sách coin */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tổng ngân sách coin
            </label>
            <Input
              type="number"
              value={totalBudgetCoin}
              onChange={(e) => setTotalBudgetCoin(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
            onClick={handleSave}
            disabled={saving}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
