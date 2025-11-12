"use client";

import { useEffect, useState, useMemo } from "react";
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
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { toast } from "sonner";

interface ViewDetailEventProps {
  eventId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function ViewDetailEvent({
  eventId,
  open,
  onClose,
}: ViewDetailEventProps) {
  const { user } = useUserProfile();

  // 🌟 Check role Cognito
  function useUserRole(user: any) {
    return useMemo(() => {
      const groups = user?.groups || []; // fix từ user.profile
      if (Array.isArray(groups)) {
        if (groups.includes("ADMINS") || groups.includes("Admin"))
          return "ADMIN";
        if (groups.includes("PARTNERS") || groups.includes("Partner"))
          return "PARTNER";
      }
      return null;
    }, [user]);
  }

  const role = useUserRole(user);
  const isPartner = role === "PARTNER";
  const isAdmin = role === "ADMIN";

  const {
    detail,
    loadingDetail,
    loadDetail,
    eventCategories,
    loadingCategories,
    updateExistingEvent,
  } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

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

  const handleUpdate = async () => {
    if (!eventId) return;

    try {
      await updateExistingEvent(eventId, {
        title,
        description,
        location,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        categoryId: categoryId!,
        pointCostToRegister: Number(pointCostToRegister),
        totalRewardPoints: Number(totalRewardPoints),
        totalBudgetCoin: Number(totalBudgetCoin),
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
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên sự kiện
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={!isPartner}
                className={`bg-gray-100 ${
                  !isPartner ? "cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                readOnly={!isPartner}
                className={`bg-gray-100 ${
                  !isPartner ? "cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Địa điểm
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                readOnly={!isPartner}
                className={`bg-gray-100 ${
                  !isPartner ? "cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Thời gian bắt đầu
                </label>
                <Input
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  readOnly={!isPartner}
                  className={`bg-gray-100 ${
                    !isPartner ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Thời gian kết thúc
                </label>
                <Input
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  readOnly={!isPartner}
                  className={`bg-gray-100 ${
                    !isPartner ? "cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Danh mục sự kiện
              </label>
              <Select
                value={categoryId ?? undefined}
                onValueChange={(v) => isPartner && setCategoryId(v)}
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
                    <SelectItem key={cat.id} value={cat.id}>
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
                onChange={(e) => setPointCostToRegister(e.target.value)}
                readOnly={!isPartner}
                className={`bg-gray-100 ${
                  !isPartner ? "cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tổng điểm thưởng
              </label>
              <Input
                value={totalRewardPoints}
                onChange={(e) => setTotalRewardPoints(e.target.value)}
                readOnly={!isPartner}
                className={`bg-gray-100 ${
                  !isPartner ? "cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tổng ngân sách coin
              </label>
              <Input
                value={totalBudgetCoin}
                onChange={(e) => setTotalBudgetCoin(e.target.value)}
                readOnly={!isPartner}
                className={`bg-gray-100 ${
                  !isPartner ? "cursor-not-allowed" : ""
                }`}
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
