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

export default function PartnerEventsPage() {
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fundMap, setFundMap] = useState<Record<number, string | number>>({});
  const [sending, setSending] = useState<Record<number, boolean>>({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
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
        const pid = data?.id;
        setPartnerId(pid ?? null);
        if (pid) {
          const list: any = await partnerService.getEvents(pid, { page: 0, size: 20 });
          setEvents(Array.isArray(list) ? list : (list && (list as any).content ? (list as any).content : []));
        }
      } catch (e: any) {
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
        const data = res?.data?.data ?? res?.data ?? [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Không tải được categories:", e);
        setCategories([]);
      } finally {
        setLoadingCats(false);
      }
    };
    load();
  }, []);

  const handleFund = async (eventId: number) => {
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

  const fetchDetail = async (id: number) => {
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
      combined.setHours(parseInt(hours), parseInt(minutes), 0);
      setEditEvent({ ...editEvent, startTime: combined.toISOString() });
    }
  };

  const handleEditStartTimeChange = (time: string) => {
    setEditStartTime(time);
    if (editStartDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(editStartDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0);
      setEditEvent({ ...editEvent, startTime: combined.toISOString() });
    }
  };

  const handleEditEndDateChange = (date: Date | undefined) => {
    setEditEndDate(date);
    if (date && editEndTime) {
      const [hours, minutes] = editEndTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0);
      setEditEvent({ ...editEvent, endTime: combined.toISOString() });
    }
  };

  const handleEditEndTimeChange = (time: string) => {
    setEditEndTime(time);
    if (editEndDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(editEndDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0);
      setEditEvent({ ...editEvent, endTime: combined.toISOString() });
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
    if (!partnerId) return;
    try {
      await axiosInstance.post("/events", {
        partnerId,
        title: form.title,
        description: form.description,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        categoryId: Number(form.categoryId) || undefined,
        pointCostToRegister: Number(form.pointCostToRegister) || 0,
        totalRewardPoints: Number(form.totalRewardPoints) || 0,
        totalBudgetCoin: Number(form.totalBudgetCoin) || 0,
      });
      toast.success("Tạo sự kiện thành công");
      setCreateOpen(false);
      window.location.reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Tạo thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/events/${id}`);
      toast.success("Đã xóa sự kiện");
      setDeleteTarget(null);
      window.location.reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Xóa thất bại");
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
                            value={(fundMap[ev.id] as any) || ""}
                            onChange={(e) => setFundMap((m) => ({ ...m, [ev.id]: e.target.value }))}
                            className="w-32 h-9"
                          />
                          <Button 
                            onClick={() => handleFund(ev.id)} 
                            disabled={!!sending[ev.id]}
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            {sending[ev.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <DollarSign className="h-4 w-4" />
                            )}
                            {sending[ev.id] ? "Đang nạp..." : "Nạp"}
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
                            onClick={() => setDeleteTarget(ev.id)}
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
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa sự kiện?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Bạn có chắc muốn xóa sự kiện này?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CreateEventModal({ open, onClose, onCreate }: any) {
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
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      if (!open) return;
      setLoadingCats(true);
      try {
        const res = await axiosInstance.get("/event-categories");
        const data = res?.data?.data ?? res?.data ?? [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Không tải được categories:", e);
        setCategories([]);
      } finally {
        setLoadingCats(false);
      }
    };
    load();
  }, [open]);

  const setField = (k: string) => (e: any) =>
    setForm((f: any) => ({ ...f, [k]: e.target.value }));

  // Combine date and time into ISO string
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && startTime) {
      const [hours, minutes] = startTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0);
      setForm((f: any) => ({ ...f, startTime: combined.toISOString() }));
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (startDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(startDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0);
      setForm((f: any) => ({ ...f, startTime: combined.toISOString() }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && endTime) {
      const [hours, minutes] = endTime.split(":");
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes), 0);
      setForm((f: any) => ({ ...f, endTime: combined.toISOString() }));
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    if (endDate && time) {
      const [hours, minutes] = time.split(":");
      const combined = new Date(endDate);
      combined.setHours(parseInt(hours), parseInt(minutes), 0);
      setForm((f: any) => ({ ...f, endTime: combined.toISOString() }));
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
            value={form.categoryId ? String(form.categoryId) : undefined}
            onValueChange={(val) => setForm((f: any) => ({ ...f, categoryId: val }))}
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
