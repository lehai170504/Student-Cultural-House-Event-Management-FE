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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEvents } from "../hooks/useEvents";
import { useEventCategories } from "@/features/eventCategories/hooks/useEventCategories";
import { showToast } from "@/components/ui/Toast";
import type { UpdateEvent } from "../types/events";

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
    updateExistingEvent,
    resetEventDetail,
    loadDetail,
  } = useEvents();
  const { list: eventCategories, loadingList } = useEventCategories();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // Load chi tiết khi eventId thay đổi
  useEffect(() => {
    if (open && eventId) {
      resetEventDetail(); // xóa detail cũ
      setIsEditing(false);
      loadDetail(eventId);
    }
  }, [eventId, open, resetEventDetail, loadDetail]);

  useEffect(() => {
    if (detail && detail.id === eventId) {
      setTitle(detail.title);
      setDescription(detail.description);
      setLocation(detail.location);
      setStartTime(detail.startTime);
      setEndTime(detail.endTime);
      setCategoryId(detail.category.id);
    }
  }, [detail, eventId]);

  const handleSave = async () => {
    if (!detail) return;

    if (!title.trim()) {
      showToast({ title: "Tên sự kiện không được để trống", icon: "warning" });
      return;
    }
    if (!categoryId) {
      showToast({ title: "Chọn danh mục sự kiện", icon: "warning" });
      return;
    }

    const updatedData: UpdateEvent = {
      title,
      description,
      location,
      startTime,
      endTime,
      categoryId,
      rewardPerCheckin: detail.rewardPerCheckin,
      status: detail.status,
    };

    try {
      await updateExistingEvent(detail.id, updatedData);
      showToast({ title: "Cập nhật sự kiện thành công", icon: "success" });
      setIsEditing(false);
    } catch {
      showToast({ title: "Lỗi khi cập nhật sự kiện", icon: "error" });
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
            {/* Tên */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên sự kiện
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!isEditing}
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
                disabled={!isEditing}
                placeholder="Nhập mô tả"
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
                disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                disabled={!isEditing || loadingList}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={loadingList ? "Đang tải..." : "Chọn danh mục"}
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
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
                onClick={handleSave}
                disabled={loadingDetail}
              >
                Lưu
              </Button>
            </>
          ) : (
            <Button
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
