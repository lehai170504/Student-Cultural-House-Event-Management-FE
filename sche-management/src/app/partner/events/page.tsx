"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Loader2,
  RotateCw,
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// @ts-ignore
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Hàm giả định cho trạng thái (lấy từ code mẫu thứ 2)
const getStatusBadge = (status: string) => {
  let classes = "";
  switch (status) {
    case "ACTIVE":
      classes = "bg-green-100 text-green-800";
      break;
    case "DRAFT":
      classes = "bg-blue-100 text-blue-800";
      break;
    case "FINISHED":
      classes = "bg-gray-100 text-gray-800";
      break;
    case "CANCELLED":
      classes = "bg-red-100 text-red-800";
      break;
    case "FINALIZED":
      classes = "bg-purple-100 text-purple-800";
      break;
    default:
      classes = "bg-gray-200 text-gray-700";
  }
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {status}
    </span>
  );
};

/**
 * Convert Date to ISO string with timezone offset +07:00 (Vietnam timezone)
 * Format: YYYY-MM-DDTHH:mm:ss.SSS+07:00
 */
function toISOStringWithTimezone(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  // Vietnam timezone offset: +07:00
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+07:00`;
}

export default function PartnerEventsPage() {
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fundMap, setFundMap] = useState<
    Record<string | number, string | number>
  >({});
  const [sending, setSending] = useState<Record<string | number, boolean>>({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | string | null>(
    null
  );
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
        const me = await axiosInstance.get("/me");
        const data = me?.data?.data ?? me?.data;
        const pid = data?.id || data?.uuid;

        if (!pid) {
          setError("Không tìm thấy ID partner trong response từ server");
          return;
        }

        const partnerIdStr = String(pid);
        setPartnerId(partnerIdStr);

        // Load events
        const list: any = await partnerService.getEvents(partnerIdStr, {
          page: 0,
          size: 20,
          sort: ["id,asc"],
        });
        const eventsArray = Array.isArray(list)
          ? list
          : list && (list as any).content
          ? (list as any).content
          : [];
        // Filter out CANCELLED events for partner's view
        const activeEvents = eventsArray.filter(
          (ev: any) => ev.status !== "CANCELLED" && ev.status !== "DELETED"
        );
        const sortedEvents = activeEvents.sort(
          (a: any, b: any) => (a.id || 0) - (b.id || 0)
        );
        setEvents(sortedEvents);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || "Không tải được danh sách sự kiện"
        );
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
        const data = res?.data?.data ?? res?.data ?? [];
        const categoriesArray = Array.isArray(data)
          ? data
          : data?.content ?? [];
        setCategories(categoriesArray);
      } catch (e: any) {
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
      // NOTE: Thao tác này KHÔNG tự động reload danh sách events, chỉ thông báo
      await partnerService.fundEvent(partnerId, { eventId, amount });
      toast.success("Nạp coin cho sự kiện thành công");
      // Cập nhật lại totalBudgetCoin của event tương ứng trong state `events`
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (String(event.id) === String(eventId)) {
            return {
              ...event,
              totalBudgetCoin: (event.totalBudgetCoin || 0) + amount,
            };
          }
          return event;
        })
      );
      setFundMap((m) => ({ ...m, [eventId]: "" }));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Nạp coin thất bại");
    } finally {
      setSending((s) => ({ ...s, [eventId]: false }));
    }
  };

  const fetchDetail = async (id: number | string) => {
    setDetailEvent(null);
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
    } else {
      setEditStartDate(undefined);
      setEditStartTime("");
    }
    if (ev.endTime) {
      const end = new Date(ev.endTime);
      setEditEndDate(end);
      setEditEndTime(format(end, "HH:mm"));
    } else {
      setEditEndDate(undefined);
      setEditEndTime("");
    }
  };

  // ... (giữ nguyên logic handleEditDateChange và handleEditTimeChange)
  const handleEditStartDateChange = (date: Date | undefined) => {
    setEditStartDate(date);
    if (date && editStartTime) {
      const [hours, minutes] = editStartTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setEditEvent({
        ...editEvent,
        startTime: toISOStringWithTimezone(combined),
      });
    } else {
      setEditEvent({ ...editEvent, startTime: "" }); // Xóa startTime nếu ngày bị xóa
    }
  };

  const handleEditStartTimeChange = (time: string) => {
    setEditStartTime(time);
    if (editStartDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(editStartDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setEditEvent({
        ...editEvent,
        startTime: toISOStringWithTimezone(combined),
      });
    } else {
      setEditEvent({ ...editEvent, startTime: "" }); // Xóa startTime nếu thời gian bị xóa
    }
  };

  const handleEditEndDateChange = (date: Date | undefined) => {
    setEditEndDate(date);
    if (date && editEndTime) {
      const [hours, minutes] = editEndTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setEditEvent({
        ...editEvent,
        endTime: toISOStringWithTimezone(combined),
      });
    } else {
      setEditEvent({ ...editEvent, endTime: "" }); // Xóa endTime nếu ngày bị xóa
    }
  };

  const handleEditEndTimeChange = (time: string) => {
    setEditEndTime(time);
    if (editEndDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(editEndDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setEditEvent({
        ...editEvent,
        endTime: toISOStringWithTimezone(combined),
      });
    } else {
      setEditEvent({ ...editEvent, endTime: "" }); // Xóa endTime nếu thời gian bị xóa
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
        categoryId: String(editEvent.categoryId) || undefined, // Đảm bảo là string UUID
        pointCostToRegister: Number(editEvent.pointCostToRegister) || 0,
        totalRewardPoints: Number(editEvent.totalRewardPoints) || 0,
        totalBudgetCoin: Number(editEvent.totalBudgetCoin) || 0,
        status: editEvent.status,
      });
      toast.success("Cập nhật sự kiện thành công");
      setEditOpen(false);
      // Cập nhật event trong state thay vì reload toàn bộ trang
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (String(event.id) === String(editEvent.id)) {
            // Cập nhật category name nếu categoryId thay đổi
            const category = categories.find(
              (cat) => String(cat.id) === String(editEvent.categoryId)
            );
            return {
              ...event,
              ...editEvent,
              category: category || event.category,
            };
          }
          return event;
        })
      );
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
      if (!form.categoryId || form.categoryId === "") {
        toast.error("Vui lòng chọn danh mục sự kiện");
        return;
      }

      let currentPartnerId = partnerId;

      if (!currentPartnerId) {
        const meResponse = await axiosInstance.get("/me");
        const meData = meResponse?.data?.data ?? meResponse?.data;
        currentPartnerId = meData?.id || meData?.uuid;

        if (!currentPartnerId) {
          toast.error("Không tìm thấy ID partner. Vui lòng đăng nhập lại.");
          return;
        }
        currentPartnerId = String(currentPartnerId);
        setPartnerId(currentPartnerId);
      }

      const categoryIdStr = String(form.categoryId);

      const payload = {
        partnerId: currentPartnerId,
        title: form.title.trim(),
        description: form.description?.trim() || "",
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location.trim(),
        categoryId: categoryIdStr,
        pointCostToRegister: Number(form.pointCostToRegister) || 0,
        totalRewardPoints: Number(form.totalRewardPoints) || 0,
        totalBudgetCoin: Number(form.totalBudgetCoin) || 0,
      };

      const response = await axiosInstance.post("/events", payload);
      const newEvent = response.data?.data ?? response.data;

      toast.success("Tạo sự kiện thành công");
      setCreateOpen(false);

      // Lấy category name để hiển thị ngay
      const category = categories.find(
        (cat) => String(cat.id) === categoryIdStr
      );

      // Thêm event mới vào danh sách
      setEvents((prevEvents) =>
        [
          {
            ...newEvent,
            category: category,
            // Đảm bảo có các trường cần thiết cho bảng (nếu API không trả về đủ)
            name: newEvent.title,
            status: newEvent.status || "DRAFT",
          },
          ...prevEvents,
        ].sort((a, b) => (a.id || 0) - (b.id || 0))
      ); // Sắp xếp lại nếu cần
    } catch (e: any) {
      const errorMessage =
        e?.response?.data?.message || e?.message || "Tạo thất bại";
      toast.error(`Lỗi: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!partnerId) {
      toast.error("Không tìm thấy thông tin partner. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const eventIdStr = String(id);
      let eventToDelete = events.find(
        (ev: any) => String(ev.id) === eventIdStr
      );

      if (!eventToDelete) {
        const eventDetail = await axiosInstance.get(`/events/${eventIdStr}`);
        eventToDelete = eventDetail?.data?.data ?? eventDetail?.data;
      }

      if (!eventToDelete) {
        toast.error("Không tìm thấy sự kiện");
        setDeleteTarget(null);
        return;
      }

      // Soft delete: Update status thành "CANCELLED"
      const updatePayload: any = {
        status: "CANCELLED",
        title: eventToDelete.title || eventToDelete.name,
        description: eventToDelete.description || "",
        startTime: eventToDelete.startTime,
        endTime: eventToDelete.endTime,
        location: eventToDelete.location,
        categoryId: eventToDelete.categoryId || eventToDelete.category?.id,
        pointCostToRegister: Number(eventToDelete.pointCostToRegister) || 0,
        totalRewardPoints: Number(eventToDelete.totalRewardPoints) || 0,
        totalBudgetCoin: Number(eventToDelete.totalBudgetCoin) || 0,
      };

      await axiosInstance.put(`/events/${eventIdStr}`, updatePayload);

      toast.success("Đã ẩn sự kiện khỏi hệ thống (xóa mềm)");
      setDeleteTarget(null);

      // Cập nhật lại danh sách: loại bỏ event đã bị CANCELLED
      setEvents((prevEvents) =>
        prevEvents.filter((ev) => String(ev.id) !== eventIdStr)
      );
    } catch (e: any) {
      let errorMessage = "Không thể ẩn sự kiện khỏi hệ thống";
      if (e?.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e?.message) {
        errorMessage = e.message;
      }

      toast.error(`Lỗi: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl shadow p-8 mt-5">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-gray-600">Đang tải sự kiện...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl shadow p-8 mt-5 text-red-800">
        <p className="text-lg font-semibold">Lỗi tải dữ liệu</p>
        <p>{error}</p>
        <Button
          variant="outline"
          className="mt-4 flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-100"
          onClick={() => window.location.reload()}
        >
          <RotateCw className="h-4 w-4" /> Thử lại
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Quản lý Sự kiện
              </h2>
              <p className="text-lg text-gray-600 mt-1">
                Quản lý và theo dõi các sự kiện của bạn (Tổng: **{events.length}
                **)
              </p>
            </div>
            <Button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-all shadow-md"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Tạo sự kiện mới
            </Button>
          </div>

          {events.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
              <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Chưa có sự kiện nào đang hoạt động
              </h3>
              <p className="text-gray-600 mb-4">
                Bắt đầu tạo sự kiện đầu tiên của bạn
              </p>
              <Button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 mx-auto bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Tạo sự kiện
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="min-w-[50px] px-6 py-3 text-gray-700 font-semibold">
                      ID
                    </TableHead>
                    <TableHead className="min-w-[250px] px-6 py-3 text-gray-700 font-semibold">
                      Tên sự kiện
                    </TableHead>
                    <TableHead className="min-w-[150px] px-6 py-3 text-gray-700 font-semibold">
                      Danh mục
                    </TableHead>
                    <TableHead className="min-w-[100px] px-6 py-3 text-gray-700 font-semibold">
                      Ngân sách (COIN)
                    </TableHead>
                    <TableHead className="min-w-[100px] px-6 py-3 text-gray-700 font-semibold">
                      Trạng thái
                    </TableHead>
                    <TableHead className="min-w-[180px] px-6 py-3 text-gray-700 font-semibold">
                      Nạp coin
                    </TableHead>
                    <TableHead className="min-w-[180px] px-6 py-3 text-gray-700 font-semibold">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((ev: any) => (
                    <TableRow
                      key={ev.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-6 py-4 text-sm font-mono text-gray-500 max-w-[50px] overflow-hidden truncate">
                        {String(ev.id).substring(0, 4)}...
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-gray-800">
                        {ev.name || ev.title || "(Không tên)"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600">
                        {ev.category?.name ||
                          categories.find(
                            (c) => String(c.id) === String(ev.categoryId)
                          )?.name ||
                          "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm font-medium text-green-600">
                        {Number(ev.totalBudgetCoin).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {getStatusBadge(ev.status || "DRAFT")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Số coin"
                            value={
                              (fundMap[ev.id as string | number] as any) || ""
                            }
                            onChange={(e) =>
                              setFundMap((m) => ({
                                ...m,
                                [ev.id]: e.target.value,
                              }))
                            }
                            className="w-24 h-9 shadow-sm"
                          />
                          <Button
                            onClick={() => handleFund(ev.id)}
                            disabled={!!sending[ev.id as string | number]}
                            size="sm"
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 transition-all shadow-md"
                          >
                            {sending[ev.id as string | number] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <DollarSign className="h-4 w-4" />
                            )}
                            {sending[ev.id as string | number]
                              ? "Đang nạp"
                              : "Nạp"}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          title="Xem chi tiết"
                          className="flex items-center gap-1 p-2 rounded-full border-2 border-orange-500 text-orange-500 font-medium transition-all duration-200 hover:bg-orange-500 hover:text-white hover:scale-105 active:scale-95 shadow-md"
                          onClick={() => {
                            fetchDetail(ev.id);
                            setDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Sửa sự kiện"
                          className="flex items-center gap-1 p-2 rounded-full border-2 border-blue-500 text-blue-500 font-medium transition-all duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 shadow-md"
                          onClick={() => handleEdit(ev)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          title="Xóa mềm sự kiện"
                          className="flex items-center gap-1 p-2 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-md"
                          onClick={() => setDeleteTarget(ev.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết sự kiện
            </DialogTitle>
          </DialogHeader>
          {detailEvent ? (
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium text-gray-700">Tiêu đề:</span>{" "}
                <span className="text-gray-900 font-semibold">
                  {detailEvent.title}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Mô tả:</span>{" "}
                <span className="text-gray-600">{detailEvent.description}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Danh mục:</span>{" "}
                <span className="text-gray-600">
                  {detailEvent.category?.name ||
                    categories.find(
                      (c) => String(c.id) === String(detailEvent.categoryId)
                    )?.name ||
                    "-"}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Địa điểm:</span>{" "}
                <span className="text-gray-600">{detailEvent.location}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Thời gian bắt đầu:
                </span>{" "}
                <span className="text-gray-600">
                  {detailEvent.startTime
                    ? new Date(detailEvent.startTime).toLocaleString("vi-VN")
                    : "-"}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Thời gian kết thúc:
                </span>{" "}
                <span className="text-gray-600">
                  {detailEvent.endTime
                    ? new Date(detailEvent.endTime).toLocaleString("vi-VN")
                    : "-"}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Phí đăng ký (Điểm):
                </span>{" "}
                <span className="text-red-500 font-medium">
                  {detailEvent.pointCostToRegister?.toLocaleString("vi-VN") ||
                    "0"}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Tổng điểm thưởng:
                </span>{" "}
                <span className="text-green-500 font-medium">
                  {detailEvent.totalRewardPoints?.toLocaleString("vi-VN") ||
                    "0"}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Ngân sách (COIN):
                </span>{" "}
                <span className="text-green-600 font-bold">
                  {detailEvent.totalBudgetCoin?.toLocaleString("vi-VN")} COIN
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Trạng thái:</span>{" "}
                {getStatusBadge(detailEvent.status || "DRAFT")}
              </p>
              <p>
                <span className="font-medium text-gray-700">Ngày tạo:</span>{" "}
                <span className="text-gray-500 text-xs">
                  {detailEvent.createdAt
                    ? new Date(detailEvent.createdAt).toLocaleString("vi-VN")
                    : "-"}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-600">Đang tải...</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {editEvent && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Sửa sự kiện
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Tiêu đề"
                value={editEvent.title}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, title: e.target.value })
                }
                className="shadow-sm"
              />
              <Input
                placeholder="Mô tả"
                value={editEvent.description}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, description: e.target.value })
                }
                className="shadow-sm"
              />
              <Input
                placeholder="Địa điểm"
                value={editEvent.location}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, location: e.target.value })
                }
                className="shadow-sm"
              />

              {/* Start Date/Time */}
              <div className="grid grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal shadow-sm",
                        !editStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editStartDate
                        ? format(editStartDate, "dd/MM/yyyy")
                        : "Chọn ngày bắt đầu"}
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
                    className="w-full shadow-sm"
                  />
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* End Date/Time */}
              <div className="grid grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal shadow-sm",
                        !editEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editEndDate
                        ? format(editEndDate, "dd/MM/yyyy")
                        : "Chọn ngày kết thúc"}
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
                    className="w-full shadow-sm"
                  />
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <Select
                value={
                  editEvent.categoryId
                    ? String(editEvent.categoryId)
                    : undefined
                }
                onValueChange={(val) =>
                  setEditEvent({ ...editEvent, categoryId: val })
                }
                disabled={loadingCats}
              >
                <SelectTrigger className="shadow-sm">
                  <SelectValue
                    placeholder={loadingCats ? "Đang tải..." : "Chọn danh mục"}
                  />
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
                onChange={(e) =>
                  setEditEvent({
                    ...editEvent,
                    pointCostToRegister: e.target.value,
                  })
                }
                className="shadow-sm"
              />
              <Input
                placeholder="Tổng điểm thưởng"
                type="number"
                value={editEvent.totalRewardPoints}
                onChange={(e) =>
                  setEditEvent({
                    ...editEvent,
                    totalRewardPoints: e.target.value,
                  })
                }
                className="shadow-sm"
              />
              <Input
                placeholder="Tổng ngân sách (coin)"
                type="number"
                value={editEvent.totalBudgetCoin}
                onChange={(e) =>
                  setEditEvent({
                    ...editEvent,
                    totalBudgetCoin: e.target.value,
                  })
                }
                className="shadow-sm"
              />
              <Select
                value={editEvent.status}
                onValueChange={(val) =>
                  setEditEvent({ ...editEvent, status: val })
                }
              >
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT (Nháp)</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE (Đã kích hoạt)</SelectItem>
                  <SelectItem value="FINISHED">
                    FINISHED (Đã kết thúc)
                  </SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED (Đã hủy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="secondary" onClick={() => setEditOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Lưu
              </Button>
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
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="max-w-md bg-white rounded-lg shadow-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-gray-800">
              Xác nhận ẩn sự kiện
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-gray-600">
              Bạn có chắc muốn ẩn sự kiện này khỏi hệ thống? Sự kiện sẽ bị ẩn
              (xóa mềm) và không còn hiển thị trong danh sách.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Đây là thao tác xóa mềm (Soft Delete -
                cập nhật trạng thái thành CANCELLED). Sự kiện vẫn được lưu trong
                cơ sở dữ liệu.
              </p>
            </div>
            {deleteTarget && (
              <p className="text-sm text-gray-500 mt-2">
                Event ID:{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                  {String(deleteTarget)}
                </code>
              </p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  handleDelete(deleteTarget);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Ẩn khỏi hệ thống
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function CreateEventModal({
  open,
  onClose,
  onCreate,
  categories = [],
  loadingCats = false,
}: any) {
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
      setForm((f: any) => ({
        ...f,
        startTime: toISOStringWithTimezone(combined),
      }));
    } else {
      setForm((f: any) => ({ ...f, startTime: "" }));
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (startDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(startDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setForm((f: any) => ({
        ...f,
        startTime: toISOStringWithTimezone(combined),
      }));
    } else {
      setForm((f: any) => ({ ...f, startTime: "" }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && endTime) {
      const [hours, minutes] = endTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setForm((f: any) => ({
        ...f,
        endTime: toISOStringWithTimezone(combined),
      }));
    } else {
      setForm((f: any) => ({ ...f, endTime: "" }));
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    if (endDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(endDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setForm((f: any) => ({
        ...f,
        endTime: toISOStringWithTimezone(combined),
      }));
    } else {
      setForm((f: any) => ({ ...f, endTime: "" }));
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
            placeholder="Tiêu đề"
            value={form.title}
            onChange={setField("title")}
            className="shadow-sm"
          />
          <Input
            placeholder="Mô tả"
            value={form.description}
            onChange={setField("description")}
            className="shadow-sm"
          />

          {/* Start Date/Time */}
          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal shadow-sm",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate
                    ? format(startDate, "dd/MM/yyyy")
                    : "Chọn ngày bắt đầu"}
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
                className="w-full shadow-sm"
              />
              <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* End Date/Time */}
          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal shadow-sm",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate
                    ? format(endDate, "dd/MM/yyyy")
                    : "Chọn ngày kết thúc"}
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
                className="w-full shadow-sm"
              />
              <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <Input
            placeholder="Địa điểm"
            value={form.location}
            onChange={setField("location")}
            className="shadow-sm"
          />
          <Select
            value={form.categoryId ? String(form.categoryId) : ""}
            onValueChange={(val) => {
              setForm((f: any) => ({ ...f, categoryId: val }));
            }}
            disabled={loadingCats}
          >
            <SelectTrigger className="shadow-sm">
              <SelectValue
                placeholder={loadingCats ? "Đang tải..." : "Chọn danh mục"}
              />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <SelectItem value="" disabled>
                  {loadingCats ? "Đang tải..." : "Không có danh mục"}
                </SelectItem>
              ) : (
                categories.map((cat: any) => {
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
            className="shadow-sm"
          />
          <Input
            placeholder="Tổng điểm thưởng"
            type="number"
            value={form.totalRewardPoints}
            onChange={setField("totalRewardPoints")}
            className="shadow-sm"
          />
          <Input
            placeholder="Tổng ngân sách (coin)"
            type="number"
            value={form.totalBudgetCoin}
            onChange={setField("totalBudgetCoin")}
            className="shadow-sm"
          />
        </div>
        <DialogFooter className="pt-4">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await onCreate(form);
                onClose(); // Đóng modal sau khi tạo thành công (logic onCreate đã handle toast)
              } finally {
                setSaving(false);
              }
            }}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
