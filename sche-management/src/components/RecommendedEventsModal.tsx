"use client";

import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import axiosInstance from "@/config/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/features/events/types/events";

interface EventCategory {
  id: number;
  name: string;
  description?: string;
}

export default function RecommendedEventsModal() {
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [preferredCategoryIds, setPreferredCategoryIds] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<EventCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [step, setStep] = useState<"choose" | "results">("choose");

  useEffect(() => {
    // Chỉ hiển thị nếu đã đăng nhập, chưa bị bỏ qua gần đây, và chưa hiển thị trong session này
    const skipUntil = localStorage.getItem("recommendedEventsSkipUntil");
    const now = Date.now();
    const isSkipped = skipUntil ? Number(skipUntil) > now : false;
    if (
      auth.isAuthenticated &&
      !auth.isLoading &&
      !isSkipped
    ) {
      initializeModal();
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user]);

  const initializeModal = async () => {
    setLoading(true);
    try {
      // Lấy thông tin profile để có eventCategories
      const meRes = await axiosInstance.get<any>("/me");
      const meData = meRes?.data?.data ?? meRes?.data ?? {};
      
      // Giả sử API trả về preferredEventCategoryIds hoặc eventCategoryIds
      const categoryIds: number[] = 
        meData?.preferredEventCategoryIds || 
        meData?.eventCategoryIds || 
        meData?.categories?.map((c: any) => c.id) || 
        [];
      setPreferredCategoryIds(categoryIds);

      // Tải danh sách tất cả categories để cho sinh viên chọn
      try {
        const catRes = await axiosInstance.get<any>("/event-categories");
        const data = catRes?.data?.data ?? catRes?.data ?? [];
        setAllCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setAllCategories([]);
      }

      // Mở modal ở bước chọn categories (prefill tối đa 3 danh mục ưa thích nếu có)
      const prefill = categoryIds.slice(0, 3);
      setSelectedCategoryIds(prefill);
      setStep("choose");
      setOpen(true);
      sessionStorage.setItem("recommendedEventsModalShown", "true");
    } catch (e: any) {
      console.error("Error loading recommended events:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadEventsForCategories = async (categoryIds: number[]) => {
    setLoading(true);
    try {
      if (categoryIds.length === 0) {
        const res = await axiosInstance.get<any>("/events", {
          params: { status: "ACTIVE", page: 1, size: 6 },
        });
        const payload = res?.data;
        const list: Event[] =
          payload?.data && Array.isArray(payload.data)
            ? payload.data
            : Array.isArray(payload)
            ? payload
            : [];
        setEvents(list);
        setStep("results");
        return;
      }

      const eventsPromises = categoryIds.map((catId) =>
        axiosInstance.get<any>("/events", {
          params: { categoryId: catId, status: "ACTIVE", page: 1, size: 6 },
        })
      );
      const results = await Promise.all(eventsPromises);
      const allEvents: Event[] = [];
      results.forEach((res) => {
        const payload = res?.data;
        const eventsList: Event[] =
          payload?.data && Array.isArray(payload.data)
            ? payload.data
            : Array.isArray(payload)
            ? payload
            : [];
        allEvents.push(...eventsList);
      });
      const uniqueEvents = Array.from(
        new Map(allEvents.map((e) => [e.id, e])).values()
      ).slice(0, 6);
      setEvents(uniqueEvents);
      setStep("results");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSkip = () => {
    // Bỏ qua trong 7 ngày
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      "recommendedEventsSkipUntil",
      String(Date.now() + sevenDaysMs)
    );
    setOpen(false);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700">Đang diễn ra</Badge>;
      case "FINALIZED":
        return <Badge className="bg-orange-100 text-orange-700">Đã kết thúc</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>;
      default:
        return null;
    }
  };

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {step === "choose" ? "Chọn danh mục bạn quan tâm" : "Sự kiện gợi ý cho bạn"}
          </DialogTitle>
          <DialogDescription>
            {step === "choose"
              ? "Hãy chọn tối đa 3 danh mục để chúng tôi gợi ý sự kiện phù hợp."
              : "Dựa trên sở thích danh mục sự kiện của bạn, chúng tôi đã chọn lọc những sự kiện phù hợp nhất."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-gray-500">
            Đang tải sự kiện gợi ý...
          </div>
        ) : step === "choose" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const checked = selectedCategoryIds.includes(cat.id);
                const disabled = !checked && selectedCategoryIds.length >= 3;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryIds((prev) => {
                        if (prev.includes(cat.id)) return prev.filter((id) => id !== cat.id);
                        if (prev.length >= 3) return prev; // guard
                        return [...prev, cat.id];
                      });
                    }}
                    disabled={disabled}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      checked
                        ? "bg-orange-500 text-white border-orange-500"
                        : disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-orange-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => loadEventsForCategories(selectedCategoryIds)}
                disabled={selectedCategoryIds.length === 0}
              >
                Xem gợi ý
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {events.map((event) => {
              const start = event.startTime
                ? new Date(event.startTime).toLocaleString()
                : "";
              return (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {event.title}
                    </h3>
                    {getStatusBadge(event.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{event.partnerName}</p>
                  <div className="space-y-1 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{start}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleClose}
                    >
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end mt-4 gap-2">
          {step === "results" && (
            <Button variant="secondary" onClick={() => setStep("choose")}>Chọn lại danh mục</Button>
          )}
          <Button variant="ghost" onClick={handleSkip}>Bỏ qua</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

