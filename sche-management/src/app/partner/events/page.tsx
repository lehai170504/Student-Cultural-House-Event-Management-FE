"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Plus, Edit, Trash2, Eye, DollarSign, Loader2 } from "lucide-react";
import axiosInstance from "@/config/axiosInstance";
import { partnerService } from "@/features/partner/services/partnerService";
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
// @ts-ignore
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Convert Date to ISO string with timezone offset +07:00 (Vietnam timezone)
 * Format: YYYY-MM-DDTHH:mm:ss.SSS+07:00
 */
function toISOStringWithTimezone(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  
  // Vietnam timezone offset: +07:00
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+07:00`;
}

export default function PartnerEventsPage() {
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fundMap, setFundMap] = useState<Record<string | number, string | number>>({});
  const [sending, setSending] = useState<Record<string | number, boolean>>({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [editStartDate, setEditStartDate] = useState<Date>();
  const [editStartTime, setEditStartTime] = useState<string>("");
  const [editEndDate, setEditEndDate] = useState<Date>();
  const [editEndTime, setEditEndTime] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi /me endpoint để lấy ID từ database (không phải từ Cognito token)
        const me = await axiosInstance.get("/me");
        console.log("📥 [load] /me full response:", me);
        
        const data = me?.data?.data ?? me?.data;
        console.log("📥 [load] /me data:", data);
        
        // Lấy ID từ database (backend trả về UUID)
        // KHÔNG dùng data?.sub (đó là từ Cognito token)
        const pid = data?.id || data?.uuid;
        
        console.log("📥 [load] Extracted partnerId:", pid);
        console.log("📥 [load] Available fields:", Object.keys(data || {}));
        
        if (!pid) {
          console.error("❌ [load] No ID found in /me response!");
          console.error("❌ [load] Full data object:", data);
          setError("Không tìm thấy ID partner trong response từ server");
          return;
        }
        
        // Đảm bảo pid là string (UUID)
        const partnerIdStr = String(pid);
        console.log("✅ [load] Final partnerId:", partnerIdStr);
        setPartnerId(partnerIdStr);
        
        // Load events
        const list: any = await partnerService.getEvents(partnerIdStr, { 
          page: 0, 
          size: 20,
          sort: ["id,asc"]
        });
        const eventsArray = Array.isArray(list) ? list : (list && (list as any).content ? (list as any).content : []);
        // Sort by ID ascending as fallback
        const sortedEvents = eventsArray.sort((a: any, b: any) => (a.id || 0) - (b.id || 0));
        setEvents(sortedEvents);
      } catch (e: any) {
        console.error("❌ [load] Error loading partner data:", e);
        console.error("❌ [load] Error response:", e?.response?.data);
        setError(e?.response?.data?.message || "Không tải được danh sách sự kiện");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load categories once on mount
  useEffect(() => {
    const load = async () => {
      setLoadingCats(true);
      try {
        const res = await axiosInstance.get("/event-categories");
        console.log("📥 [loadCategories] Full response:", res);
        const data = res?.data?.data ?? res?.data ?? [];
        const categoriesArray = Array.isArray(data) ? data : (data?.content ?? []);
        console.log("📥 [loadCategories] Categories loaded:", categoriesArray);
        console.log("📥 [loadCategories] Categories count:", categoriesArray.length);
        if (categoriesArray.length > 0) {
          console.log("📥 [loadCategories] First category:", categoriesArray[0]);
        }
        setCategories(categoriesArray);
      } catch (e: any) {
        console.error("❌ [loadCategories] Error loading categories:", e);
        console.error("❌ [loadCategories] Error response:", e?.response?.data);
        setCategories([]);
      } finally {
        setLoadingCats(false);
      }
    };
    load();
  }, []);

  const handleFund = async (eventId: number | string) => {
    if (!partnerId) return;
    const amount = Number(fundMap[eventId]);
    if (!amount || amount <= 0) {
      toast.warning("Số coin không hợp lệ");
      return;
    }
    setSending((s) => ({ ...s, [eventId]: true }));
    try {
      await partnerService.fundEvent(partnerId, { eventId, amount });
      toast.success("Nạp coin cho sự kiện thành công");
      setFundMap((m) => ({ ...m, [eventId]: "" }));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Nạp coin thất bại");
    } finally {
      setSending((s) => ({ ...s, [eventId]: false }));
    }
  };

  const fetchDetail = async (id: number | string) => {
    try {
      const res = await axiosInstance.get(`/events/${id}`);
      const event = res?.data?.data ?? res?.data;
      setDetailEvent(event);
    } catch (e: any) {
      toast.error("Không lấy được chi tiết sự kiện");
    }
  };

  const handleEdit = async (ev: any) => {
    setEditEvent(ev);
    setEditOpen(true);
    // Parse existing dates
    if (ev.startTime) {
      const start = new Date(ev.startTime);
      setEditStartDate(start);
      setEditStartTime(format(start, "HH:mm"));
    }
    if (ev.endTime) {
      const end = new Date(ev.endTime);
      setEditEndDate(end);
      setEditEndTime(format(end, "HH:mm"));
    }
  };

  const handleEditStartDateChange = (date: Date | undefined) => {
    setEditStartDate(date);
    if (date && editStartTime) {
      const [hours, minutes] = editStartTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setEditEvent({ ...editEvent, startTime: toISOStringWithTimezone(combined) });
    }
  };

  const handleEditStartTimeChange = (time: string) => {
    setEditStartTime(time);
    if (editStartDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(editStartDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setEditEvent({ ...editEvent, startTime: toISOStringWithTimezone(combined) });
    }
  };

  const handleEditEndDateChange = (date: Date | undefined) => {
    setEditEndDate(date);
    if (date && editEndTime) {
      const [hours, minutes] = editEndTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setEditEvent({ ...editEvent, endTime: toISOStringWithTimezone(combined) });
    }
  };

  const handleEditEndTimeChange = (time: string) => {
    setEditEndTime(time);
    if (editEndDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(editEndDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setEditEvent({ ...editEvent, endTime: toISOStringWithTimezone(combined) });
    }
  };

  const handleSaveEdit = async () => {
    if (!editEvent) return;
    try {
      await axiosInstance.put(`/events/${editEvent.id}`, {
        title: editEvent.title,
        description: editEvent.description,
        startTime: editEvent.startTime,
        endTime: editEvent.endTime,
        location: editEvent.location,
        categoryId: Number(editEvent.categoryId) || undefined,
        pointCostToRegister: Number(editEvent.pointCostToRegister) || 0,
        totalRewardPoints: Number(editEvent.totalRewardPoints) || 0,
        totalBudgetCoin: Number(editEvent.totalBudgetCoin) || 0,
        status: editEvent.status,
      });
      toast.success("Cập nhật sự kiện thành công");
      setEditOpen(false);
      window.location.reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handleCreate = async (form: any) => {
    try {
      // Validate required fields
      if (!form.title || !form.title.trim()) {
        toast.error("Vui lòng nhập tiêu đề sự kiện");
        return;
      }
      if (!form.startTime || !form.endTime) {
        toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc");
        return;
      }
      if (!form.location || !form.location.trim()) {
        toast.error("Vui lòng nhập địa điểm");
        return;
      }
      // Lấy partnerId từ /me endpoint (bắt buộc phải có)
      let currentPartnerId = partnerId;
      
      // Nếu partnerId chưa có, gọi lại /me để lấy
      if (!currentPartnerId) {
        console.log("⚠️ [handleCreate] partnerId is null, fetching from /me...");
        try {
          const meResponse = await axiosInstance.get("/me");
          const meData = meResponse?.data?.data ?? meResponse?.data;
          console.log("📥 [handleCreate] /me response:", meData);
          
          // Lấy ID từ database (không phải từ Cognito token)
          currentPartnerId = meData?.id || meData?.uuid;
          
          if (!currentPartnerId) {
            console.error("❌ [handleCreate] No ID found in /me response:", meData);
            toast.error("Không tìm thấy ID partner. Vui lòng đăng nhập lại.");
            return;
          }
          
          // Đảm bảo là string (UUID)
          currentPartnerId = String(currentPartnerId);
          console.log("✅ [handleCreate] Got partnerId from /me:", currentPartnerId);
          
          // Update state
          setPartnerId(currentPartnerId);
        } catch (meError: any) {
          console.error("❌ [handleCreate] Error fetching /me:", meError);
          toast.error("Không thể lấy thông tin partner. Vui lòng thử lại.");
          return;
        }
      }

      // Validate categoryId - Backend yêu cầu UUID string (không phải number!)
      console.log("🔍 [handleCreate] Full form object:", form);
      console.log("🔍 [handleCreate] form.categoryId:", form.categoryId);
      console.log("🔍 [handleCreate] form.categoryId type:", typeof form.categoryId);
      console.log("🔍 [handleCreate] Available categories:", categories);
      
      // Check if categoryId exists and is not empty
      if (!form.categoryId || form.categoryId === "" || form.categoryId === null || form.categoryId === undefined) {
        console.error("❌ [handleCreate] categoryId is empty or null");
        toast.error("Vui lòng chọn danh mục sự kiện");
        return;
      }

      // Backend yêu cầu categoryId là UUID string, KHÔNG convert sang number!
      const categoryIdStr = String(form.categoryId);
      
      console.log("🔍 [handleCreate] categoryIdStr (UUID):", categoryIdStr);
      
      // Verify category exists in the list (so sánh string với string)
      const categoryExists = categories.some((cat: any) => {
        const catIdStr = String(cat.id);
        return catIdStr === categoryIdStr;
      });
      
      if (!categoryExists) {
        console.error("❌ [handleCreate] categoryId not found in categories list:", categoryIdStr);
        console.error("❌ [handleCreate] Available category IDs:", categories.map((c: any) => String(c.id)));
        toast.error("Danh mục sự kiện không tồn tại. Vui lòng chọn lại.");
        return;
      }
      
      console.log("✅ [handleCreate] categoryId validation passed:", categoryIdStr);

      // Prepare payload - Backend yêu cầu cả partnerId và categoryId đều là UUID string
      const payload = {
        partnerId: currentPartnerId, // UUID string từ database (lấy từ /me)
        title: form.title.trim(),
        description: form.description?.trim() || "",
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location.trim(),
        categoryId: categoryIdStr, // UUID string (KHÔNG phải number!)
        pointCostToRegister: Number(form.pointCostToRegister) || 0,
        totalRewardPoints: Number(form.totalRewardPoints) || 0,
        totalBudgetCoin: Number(form.totalBudgetCoin) || 0,
      };

      console.log("📤 [handleCreate] Sending payload:", JSON.stringify(payload, null, 2));
      console.log("📤 [handleCreate] partnerId:", currentPartnerId);
      console.log("📤 [handleCreate] partnerId type:", typeof currentPartnerId);

      const response = await axiosInstance.post("/events", payload);
      console.log("✅ [handleCreate] Success response:", response.data);
      
      toast.success("Tạo sự kiện thành công");
      setCreateOpen(false);
      window.location.reload();
    } catch (e: any) {
      console.error("❌ [handleCreate] Error:", e);
      console.error("❌ [handleCreate] Error response:", e?.response?.data);
      const errorMessage = e?.response?.data?.message || e?.message || "Tạo thất bại";
      toast.error(`Lỗi: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!partnerId) {
      console.error("❌ [handleDelete] partnerId is null, cannot reload events");
      toast.error("Không tìm thấy thông tin partner. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      // Đảm bảo id là string (UUID) để gửi đúng format
      const eventIdStr = String(id);
      console.log("🗑️ [handleDelete] ========================================");
      console.log("🗑️ [handleDelete] Soft deleting event ID:", eventIdStr);
      console.log("🗑️ [handleDelete] Event ID type:", typeof eventIdStr);
      console.log("🗑️ [handleDelete] Full event ID:", eventIdStr);
      console.log("🗑️ [handleDelete] Current partnerId:", partnerId);
      console.log("🗑️ [handleDelete] Note: This is a SOFT DELETE - updating status to CANCELLED");
      
      // Tìm event trong danh sách để lấy thông tin hiện tại
      let eventToDelete = events.find((ev: any) => String(ev.id) === eventIdStr);
      
      // Nếu không tìm thấy trong danh sách, fetch event detail từ API
      if (!eventToDelete) {
        console.log("⚠️ [handleDelete] Event not found in current list, fetching from API...");
        try {
          const eventDetail = await axiosInstance.get(`/events/${eventIdStr}`);
          eventToDelete = eventDetail?.data?.data ?? eventDetail?.data;
          console.log("📥 [handleDelete] Event fetched from API:", eventToDelete);
        } catch (fetchError: any) {
          console.error("❌ [handleDelete] Error fetching event detail:", fetchError);
          toast.error("Không tìm thấy sự kiện trong danh sách");
          setDeleteTarget(null);
          return;
        }
      }
      
      if (!eventToDelete) {
        console.error("❌ [handleDelete] Event not found after fetch:", eventIdStr);
        toast.error("Không tìm thấy sự kiện");
        setDeleteTarget(null);
        return;
      }
      
      console.log("📋 [handleDelete] Event to delete:", eventToDelete);
      console.log("📋 [handleDelete] Current status:", eventToDelete.status);
      
      // Soft delete: Update status thành "CANCELLED" thay vì DELETE
      // Sử dụng PUT để update event (tương tự handleSaveEdit)
      // Chỉ update status, giữ nguyên các trường khác
      const updatePayload: any = {
        status: "CANCELLED", // Set status thành CANCELLED để soft delete
      };
      
      // Chỉ thêm các trường bắt buộc nếu có trong event
      if (eventToDelete.title || eventToDelete.name) {
        updatePayload.title = eventToDelete.title || eventToDelete.name;
      }
      if (eventToDelete.description) {
        updatePayload.description = eventToDelete.description;
      }
      if (eventToDelete.startTime) {
        updatePayload.startTime = eventToDelete.startTime;
      }
      if (eventToDelete.endTime) {
        updatePayload.endTime = eventToDelete.endTime;
      }
      if (eventToDelete.location) {
        updatePayload.location = eventToDelete.location;
      }
      if (eventToDelete.categoryId || eventToDelete.category?.id) {
        updatePayload.categoryId = eventToDelete.categoryId || eventToDelete.category?.id;
      }
      if (eventToDelete.pointCostToRegister !== undefined) {
        updatePayload.pointCostToRegister = Number(eventToDelete.pointCostToRegister) || 0;
      }
      if (eventToDelete.totalRewardPoints !== undefined) {
        updatePayload.totalRewardPoints = Number(eventToDelete.totalRewardPoints) || 0;
      }
      if (eventToDelete.totalBudgetCoin !== undefined) {
        updatePayload.totalBudgetCoin = Number(eventToDelete.totalBudgetCoin) || 0;
      }
      
      console.log("📤 [handleDelete] Update payload:", JSON.stringify(updatePayload, null, 2));
      console.log("📤 [handleDelete] PUT URL:", `/events/${eventIdStr}`);
      
      // Gọi API PUT để update status thành CANCELLED (soft delete)
      const response = await axiosInstance.put(`/events/${eventIdStr}`, updatePayload);
      console.log("✅ [handleDelete] Soft delete successful:", response.data);
      console.log("✅ [handleDelete] Response status:", response.status);
      
      // Thông báo thành công (xóa mềm - event đã bị ẩn khỏi hệ thống)
      toast.success("Đã ẩn sự kiện khỏi hệ thống (xóa mềm)");
      setDeleteTarget(null);
      
      // Reload events list - event đã bị soft delete (status = CANCELLED) sẽ không còn trong danh sách
      try {
        console.log("🔄 [handleDelete] Reloading events list (CANCELLED events will be hidden)...");
        const list: any = await partnerService.getEvents(partnerId, { 
          page: 0, 
          size: 20,
          sort: ["id,asc"]
        });
        const eventsArray = Array.isArray(list) ? list : (list && (list as any).content ? (list as any).content : []);
        
        // Filter out CANCELLED events (soft deleted events)
        // Backend có thể đã filter, nhưng để an toàn, ta filter thêm ở frontend
        const activeEvents = eventsArray.filter((ev: any) => {
          // Chỉ hiển thị các event không bị soft delete (status không phải CANCELLED)
          return ev.status !== "CANCELLED" && ev.status !== "DELETED";
        });
        
        const sortedEvents = activeEvents.sort((a: any, b: any) => {
          // Sort by string ID if UUID, or number ID
          if (typeof a.id === 'string' && typeof b.id === 'string') {
            return a.id.localeCompare(b.id);
          }
          return (a.id || 0) - (b.id || 0);
        });
        
        setEvents(sortedEvents);
        console.log("✅ [handleDelete] Events list reloaded");
        console.log("✅ [handleDelete] Total events before filter:", eventsArray.length);
        console.log("✅ [handleDelete] Active events after filter:", sortedEvents.length);
        console.log("✅ [handleDelete] CANCELLED events are now hidden from the list");
      } catch (reloadError: any) {
        console.error("❌ [handleDelete] Error reloading events:", reloadError);
        console.error("❌ [handleDelete] Reload error response:", reloadError?.response?.data);
        // Event đã được soft delete thành công, reload trang để hiển thị danh sách mới
        // (Event đã bị ẩn sẽ không còn hiển thị)
        window.location.reload();
      }
    } catch (e: any) {
      console.error("❌ [handleDelete] ========================================");
      console.error("❌ [handleDelete] Error:", e);
      console.error("❌ [handleDelete] Error response:", e?.response?.data);
      console.error("❌ [handleDelete] Error status:", e?.response?.status);
      console.error("❌ [handleDelete] Error config:", e?.config);
      console.error("❌ [handleDelete] Event ID attempted:", id);
      console.error("❌ [handleDelete] Event ID type:", typeof id);
      
      // More detailed error message
      let errorMessage = "Không thể ẩn sự kiện khỏi hệ thống";
      if (e?.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e?.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      toast.error(`Lỗi: ${errorMessage}`);
      
      // Don't close dialog on error, let user see the error
      // setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-gray-600">Đang tải sự kiện...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Quản lý Sự kiện</h2>
            <p className="text-gray-600 mt-1">Quản lý và theo dõi các sự kiện của bạn</p>
          </div>
          <Button 
            onClick={() => setCreateOpen(true)} 
            className="flex items-center gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Tạo sự kiện mới
          </Button>
        </div>

        {events.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có sự kiện</h3>
            <p className="text-gray-600 mb-4">Bắt đầu tạo sự kiện đầu tiên của bạn</p>
            <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Tạo sự kiện
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">ID</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Tên sự kiện</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Trạng thái</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Nạp coin</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((ev: any) => (
                    <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{ev.id}</td>
                      <td className="px-6 py-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          onClick={() => {
                            fetchDetail(ev.id);
                            setDetailOpen(true);
                          }}
                        >
                          {ev.name || ev.title || "(Không tên)"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          ev.status === "ACTIVE" && "bg-green-100 text-green-800",
                          ev.status === "DRAFT" && "bg-gray-100 text-gray-800",
                          ev.status === "FINISHED" && "bg-blue-100 text-blue-800",
                          ev.status === "CANCELLED" && "bg-red-100 text-red-800"
                        )}>
                          {ev.status || "DRAFT"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Số coin"
                            value={(fundMap[ev.id as string | number] as any) || ""}
                            onChange={(e) => setFundMap((m) => ({ ...m, [ev.id]: e.target.value }))}
                            className="w-32 h-9"
                          />
                          <Button 
                            onClick={() => handleFund(ev.id)} 
                            disabled={!!sending[ev.id as string | number]}
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            {sending[ev.id as string | number] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <DollarSign className="h-4 w-4" />
                            )}
                            {sending[ev.id as string | number] ? "Đang nạp..." : "Nạp"}
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              fetchDetail(ev.id);
                              setDetailOpen(true);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Chi tiết
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(ev)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              console.log("🗑️ [onClick] Setting deleteTarget to event ID:", ev.id);
                              console.log("🗑️ [onClick] Event ID type:", typeof ev.id);
                              setDeleteTarget(ev.id);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sự kiện</DialogTitle>
          </DialogHeader>
          {detailEvent ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">ID:</span> {detailEvent.id}</p>
              <p><span className="font-medium">Tiêu đề:</span> {detailEvent.title}</p>
              <p><span className="font-medium">Mô tả:</span> {detailEvent.description}</p>
              <p><span className="font-medium">Danh mục:</span> {detailEvent.category?.name || "-"}</p>
              <p><span className="font-medium">Địa điểm:</span> {detailEvent.location}</p>
              <p><span className="font-medium">Bắt đầu:</span> {detailEvent.startTime}</p>
              <p><span className="font-medium">Kết thúc:</span> {detailEvent.endTime}</p>
              <p><span className="font-medium">Điểm phí đăng ký:</span> {detailEvent.pointCostToRegister?.toLocaleString("vi-VN") || "-"}</p>
              <p><span className="font-medium">Tổng điểm thưởng:</span> {detailEvent.totalRewardPoints?.toLocaleString("vi-VN") || "-"}</p>
              <p><span className="font-medium">Ngân sách:</span> {detailEvent.totalBudgetCoin?.toLocaleString("vi-VN")} COIN</p>
              <p><span className="font-medium">Số người tối đa:</span> {detailEvent.maxAttendees || "-"}</p>
              <p><span className="font-medium">Trạng thái:</span> {detailEvent.status}</p>
              <p><span className="font-medium">Ngày tạo:</span> {detailEvent.createdAt ? new Date(detailEvent.createdAt).toLocaleString("vi-VN") : "-"}</p>
            </div>
          ) : (
            <p className="text-gray-600">Đang tải...</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {editEvent && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Sửa sự kiện</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Tiêu đề"
                value={editEvent.title}
                onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
              />
              <Input
                placeholder="Mô tả"
                value={editEvent.description}
                onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
              />
              <Input
                placeholder="Địa điểm"
                value={editEvent.location}
                onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
              />
              
              {/* Start Date/Time */}
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editStartDate ? format(editStartDate, "dd/MM/yyyy") : "Chọn ngày bắt đầu"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editStartDate}
                      onSelect={handleEditStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative">
                  <Input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => handleEditStartTimeChange(e.target.value)}
                    className="w-full"
                  />
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* End Date/Time */}
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editEndDate ? format(editEndDate, "dd/MM/yyyy") : "Chọn ngày kết thúc"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editEndDate}
                      onSelect={handleEditEndDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative">
                  <Input
                    type="time"
                    value={editEndTime}
                    onChange={(e) => handleEditEndTimeChange(e.target.value)}
                    className="w-full"
                  />
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <Select
                value={editEvent.categoryId ? String(editEvent.categoryId) : undefined}
                onValueChange={(val) => setEditEvent({ ...editEvent, categoryId: val })}
                disabled={loadingCats}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingCats ? "Đang tải..." : "Chọn danh mục"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Điểm phí đăng ký"
                type="number"
                value={editEvent.pointCostToRegister}
                onChange={(e) => setEditEvent({ ...editEvent, pointCostToRegister: e.target.value })}
              />
              <Input
                placeholder="Tổng điểm thưởng"
                type="number"
                value={editEvent.totalRewardPoints}
                onChange={(e) => setEditEvent({ ...editEvent, totalRewardPoints: e.target.value })}
              />
              <Input
                placeholder="Tổng ngân sách (coin)"
                type="number"
                value={editEvent.totalBudgetCoin}
                onChange={(e) => setEditEvent({ ...editEvent, totalBudgetCoin: e.target.value })}
              />
              <Select
                value={editEvent.status}
                onValueChange={(val) => setEditEvent({ ...editEvent, status: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT (Nháp)</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE (Đã kích hoạt)</SelectItem>
                  <SelectItem value="FINISHED">FINISHED (Đã kết thúc)</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED (Đã hủy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setEditOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveEdit}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Modal */}
      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        categories={categories}
        loadingCats={loadingCats}
      />

      {/* Delete Confirmation (Soft Delete) */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => {
        if (!open) {
          setDeleteTarget(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ẩn sự kiện khỏi hệ thống?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-gray-600">
              Bạn có chắc muốn ẩn sự kiện này khỏi hệ thống? 
              Sự kiện sẽ bị ẩn (xóa mềm) và không còn hiển thị trong danh sách.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Đây là thao tác xóa mềm (soft delete). 
                Sự kiện sẽ bị ẩn khỏi hệ thống nhưng vẫn được lưu trong cơ sở dữ liệu.
              </p>
            </div>
            {deleteTarget && (
              <p className="text-sm text-gray-500 mt-2">
                Event ID: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{String(deleteTarget)}</code>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  console.log("🗑️ [Dialog] Soft delete button clicked");
                  console.log("🗑️ [Dialog] deleteTarget value:", deleteTarget);
                  console.log("🗑️ [Dialog] deleteTarget type:", typeof deleteTarget);
                  handleDelete(deleteTarget);
                } else {
                  console.error("❌ [Dialog] deleteTarget is null/undefined");
                }
              }}
            >
              Ẩn khỏi hệ thống
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CreateEventModal({ open, onClose, onCreate, categories = [], loadingCats = false }: any) {
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
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState<string>("");

  // Reset form when modal closes
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

  const setField = (k: string) => (e: any) =>
    setForm((f: any) => ({ ...f, [k]: e.target.value }));

  // Combine date and time into ISO string with timezone offset
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && startTime) {
      const [hours, minutes] = startTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setForm((f: any) => ({ ...f, startTime: toISOStringWithTimezone(combined) }));
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (startDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(startDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setForm((f: any) => ({ ...f, startTime: toISOStringWithTimezone(combined) }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && endTime) {
      const [hours, minutes] = endTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setForm((f: any) => ({ ...f, endTime: toISOStringWithTimezone(combined) }));
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    if (endDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(endDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setForm((f: any) => ({ ...f, endTime: toISOStringWithTimezone(combined) }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo sự kiện mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Tiêu đề" value={form.title} onChange={setField("title")} />
          <Input
            placeholder="Mô tả"
            value={form.description}
            onChange={setField("description")}
          />
          
          {/* Start Date/Time */}
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Chọn ngày bắt đầu"}
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
                className="w-full"
              />
              <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* End Date/Time */}
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : "Chọn ngày kết thúc"}
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
                className="w-full"
              />
              <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <Input
            placeholder="Địa điểm"
            value={form.location}
            onChange={setField("location")}
          />
          <Select
            value={form.categoryId ? String(form.categoryId) : ""}
            onValueChange={(val) => {
              console.log("📝 [CreateEventModal] Selected category:", val);
              setForm((f: any) => ({ ...f, categoryId: val }));
            }}
            disabled={loadingCats}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingCats ? "Đang tải..." : "Chọn danh mục"} />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <SelectItem value="" disabled>
                  {loadingCats ? "Đang tải..." : "Không có danh mục"}
                </SelectItem>
              ) : (
                categories.map((cat: any) => {
                  console.log("📋 [CreateEventModal] Category:", cat.id, cat.name);
                  return (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  );
                })
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
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await onCreate(form);
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Đang tạo..." : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
