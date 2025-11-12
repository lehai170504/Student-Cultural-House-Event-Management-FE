"use client";

import { useEffect, useState } from "react";
import { Bell, Send, Loader2, MessageSquare } from "lucide-react";
import axiosInstance from "@/config/axiosInstance";
import { partnerService } from "@/features/partner/services/partnerService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// @ts-ignore
import { toast } from "sonner";

export default function PartnerNotificationsPage() {
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const me = await axiosInstance.get("/me");
        const data = me?.data?.data ?? me?.data;
        // Backend đã đổi sang UUID (string), lấy id hoặc uuid
        const pid = data?.id || data?.uuid || data?.sub;
        // Đảm bảo pid là string (UUID)
        const partnerIdStr = pid ? String(pid) : null;
        setPartnerId(partnerIdStr);
        if (partnerIdStr) {
          const list: any = await partnerService.getEvents(partnerIdStr, { page: 0, size: 50 });
          setEvents(Array.isArray(list) ? list : (list?.content ?? []));
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || "Không tải được sự kiện");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSend = async () => {
    if (!partnerId) return;
    const eventId = selected; // Giữ nguyên string vì có thể là UUID
    if (!eventId) {
      toast.warning("Vui lòng chọn sự kiện");
      return;
    }
    if (!message.trim()) {
      toast.warning("Vui lòng nhập nội dung");
      return;
    }
    setSending(true);
    try {
      await partnerService.broadcast(partnerId, { eventId, messageContent: message.trim() });
      toast.success("Đã gửi thông báo tới người tham dự");
      setMessage("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gửi thông báo thất bại");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="h-8 w-8 text-orange-500" />
          Tạo thông báo sự kiện
        </h2>
        <p className="text-gray-600 mt-1">Gửi thông báo tới những người tham gia sự kiện</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-2" />
            <p className="text-gray-600">Đang tải danh sách sự kiện...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Chọn sự kiện <span className="text-red-500">*</span>
            </label>
            <Select value={selected} onValueChange={setSelected} disabled={sending}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Chọn một sự kiện từ danh sách" />
              </SelectTrigger>
              <SelectContent>
                {events.length === 0 ? (
                  <SelectItem value="no-events" disabled>
                    Không có sự kiện nào
                  </SelectItem>
                ) : (
                  events.map((ev: any) => (
                    <SelectItem key={ev.id} value={String(ev.id)}>
                      {ev.name || ev.title || `Sự kiện #${ev.id}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nội dung thông báo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập nội dung thông báo để gửi đến người tham dự sự kiện..."
                className="pl-10 min-h-[120px] resize-none"
                disabled={sending}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setSelected("");
                setMessage("");
              }}
              disabled={sending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !selected || !message.trim()}
              className="flex items-center gap-2 min-w-[140px]"
              size="lg"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Gửi thông báo
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


