"use client";

import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Eye,
  Coins,
  PlusCircle,
  Trash2,
  CheckSquare,
  UserRound,
} from "lucide-react";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { usePartners } from "@/features/partner/hooks/usePartners";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useRouter } from "next/navigation";
import type {
  EventCheckinDetail,
  EventForCheckin,
} from "@/features/events/types/events";

const ViewDetailEvent = lazy(() => import("./ViewDetailEvent"));
const CreateEventModal = lazy(() => import("./CreateEventModal"));
const CheckinPhoneNumberDialog = lazy(
  () => import("./CheckinPhoneNumberDialog")
);

interface PartnerEvent {
  id: string | number;
  title?: string;
  partnerName?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  totalBudgetCoin?: number;
  pointCostToRegister?: number;
}

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const getStatusBadgeClass = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-600 border border-emerald-200";
    case "FINALIZED":
      return "bg-purple-100 text-purple-600 border border-purple-200";
    case "CANCELLED":
      return "bg-red-100 text-red-600 border border-red-200";
    case "DRAFT":
      return "bg-blue-100 text-blue-600 border border-blue-200";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200";
  }
};

export default function PartnerEventTable() {
  const { user } = useUserProfile();
  const partnerId = user?.id;

  const router = useRouter();

  const {
    events: partnerEvents,
    loadingEvents,
    loadPartnerEvents,
    fundEvent,
    lastMessage,
  } = usePartners({ autoLoad: false });

  const {
    submittingCheckin,
    submitCheckinAndNotify,
    deleteEventById,
  } = useEvents();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | number | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [topUpEvent, setTopUpEvent] = useState<PartnerEvent | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [isFunding, setIsFunding] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [currentCheckinEvent, setCurrentCheckinEvent] =
    useState<EventForCheckin | null>(null);
  const [processingEventId, setProcessingEventId] = useState<string | null>(null);
  const [deleteEventTarget, setDeleteEventTarget] = useState<PartnerEvent | null>(
    null
  );
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  const reloadPartnerEvents = useCallback(
    async (params?: Record<string, any>) => {
      if (!partnerId) return;
      await loadPartnerEvents(partnerId, params);
    },
    [partnerId, loadPartnerEvents]
  );

  useEffect(() => {
    if (!partnerId) return;
    reloadPartnerEvents({ page: 1, size: 20 }).catch((err) => {
      console.error(err);
      toast.error("Không thể tải danh sách sự kiện của đối tác.");
    });
  }, [partnerId, reloadPartnerEvents]);

  useEffect(() => {
    if (lastMessage) {
      toast.success(lastMessage);
    }
  }, [lastMessage]);

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(partnerEvents)) return [];
    if (!searchKeyword) return partnerEvents;
    const lower = searchKeyword.toLowerCase();
    return partnerEvents.filter((event: PartnerEvent) =>
      (event?.title || "").toLowerCase().includes(lower)
    );
  }, [partnerEvents, searchKeyword]);

  const handleOpenDetail = useCallback((eventId: string | number) => {
    setSelectedEventId(eventId);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedEventId(null);
  };

  const handleOpenTopUp = (event: PartnerEvent) => {
    setTopUpEvent(event);
    setTopUpAmount("");
  };

  const handleCloseTopUp = () => {
    if (isFunding) return;
    setTopUpEvent(null);
    setTopUpAmount("");
  };

  const handleConfirmTopUp = async () => {
    if (!partnerId || !topUpEvent) return;
    const amountNumber = Number(topUpAmount);
    if (!amountNumber || amountNumber <= 0) {
      toast.error("Vui lòng nhập số coin hợp lệ (lớn hơn 0).");
      return;
    }
    try {
      setIsFunding(true);
      await fundEvent(partnerId, topUpEvent.id, amountNumber);
      toast.success("Nạp coin thành công!", {
        description: `Đã nạp ${amountNumber} coin cho sự kiện ${
          topUpEvent.title || topUpEvent.id
        }.`,
      });
      await reloadPartnerEvents({ page: 1, size: 20 });
      handleCloseTopUp();
    } catch (err: any) {
      const message =
        err?.message || "Không thể nạp coin cho sự kiện. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsFunding(false);
    }
  };

  const openCheckinModal = useCallback(
    (event: PartnerEvent) => {
      if (!user) return;
      setCurrentCheckinEvent({
        id: String(event.id),
        title: event.title ?? "Sự kiện",
        studentId: String(user.id),
        studentName: user.fullName ?? "Người tham dự",
      });
      setIsCheckinModalOpen(true);
    },
    [user]
  );

  const closeCheckinModal = () => {
    setIsCheckinModalOpen(false);
    setCurrentCheckinEvent(null);
    setProcessingEventId(null);
  };

  const handleCheckinSubmit = useCallback(
    async (payload: { eventId: string; phoneNumber: string }) => {
      if (!currentCheckinEvent) return;
      const fullPayload: EventCheckinDetail & { phoneNumber: string } = {
        checkinId: "",
        eventId: payload.eventId,
        eventTitle: currentCheckinEvent.title,
        studentId: Number(currentCheckinEvent.studentId) || 0,
        studentName: currentCheckinEvent.studentName,
        registrationTime: new Date().toISOString(),
        verified: false,
        depositPaid: 0,
        phoneNumber: payload.phoneNumber,
      };
      setProcessingEventId(payload.eventId);
      try {
        await submitCheckinAndNotify(fullPayload);
        toast.success("Check-in thành công!");
        closeCheckinModal();
      } catch (error: any) {
        toast.error(
          error?.message || "Không thể check-in người tham dự. Vui lòng thử lại."
        );
      } finally {
        setProcessingEventId(null);
      }
    },
    [currentCheckinEvent, submitCheckinAndNotify]
  );

  const handleOpenDelete = (event: PartnerEvent) => {
    setDeleteEventTarget(event);
  };

  const handleCloseDelete = () => {
    if (isDeletingEvent) return;
    setDeleteEventTarget(null);
    setProcessingEventId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteEventTarget?.id) return;
    try {
      setIsDeletingEvent(true);
      setProcessingEventId(String(deleteEventTarget.id));
      await deleteEventById(String(deleteEventTarget.id));
      toast.success("Đã xóa sự kiện.");
      await reloadPartnerEvents({ page: 1, size: 20 });
      handleCloseDelete();
    } catch (error: any) {
      toast.error(
        error?.message || "Không thể xóa sự kiện. Vui lòng thử lại sau."
      );
    } finally {
      setIsDeletingEvent(false);
      setProcessingEventId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <section className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Sự kiện của đối tác
            </h1>
            <p className="text-gray-600">
              Chỉ hiển thị sự kiện do bạn tổ chức. Tổng số:{" "}
              <strong>{filteredEvents.length}</strong>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <Input
              placeholder="Tìm kiếm theo tên sự kiện..."
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              className="w-full sm:w-64"
            />
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Tạo sự kiện
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {[
                  "Tên sự kiện",
                  "Địa điểm",
                  "Bắt đầu",
                  "Kết thúc",
                  "Trạng thái",
                  "Ngân sách (coin)",
                  "Hành động",
                ].map((header) => (
                  <TableHead key={header} className="px-6 py-3 text-gray-700">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEvents ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải danh sách sự kiện...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    <p className="text-gray-500">
                      Không có sự kiện nào phù hợp với tìm kiếm.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event: PartnerEvent) => (
                  <TableRow key={event.id} className="hover:bg-gray-50">
                    <TableCell className="px-6 py-4 font-semibold text-gray-800">
                      {event.title || "Chưa đặt tên"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600">
                      {event.location || "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600">
                      {formatDateTime(event.startTime)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600">
                      {formatDateTime(event.endTime)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                          event.status
                        )}`}
                      >
                        {event.status || "UNKNOWN"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600">
                      {event.totalBudgetCoin ?? 0}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white"
                          onClick={() => handleOpenDetail(String(event.id))}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                          onClick={() => handleOpenTopUp(event)}
                        >
                          <Coins className="h-4 w-4" />
                        </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                        onClick={() => router.push(`/partner/events/${event.id}`)}
                      >
                        <UserRound className="h-4 w-4" />
                      </Button>
                      {event.status === "ACTIVE" && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                          onClick={() => openCheckinModal(event)}
                        >
                          {processingEventId === String(event.id) && isCheckinModalOpen ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckSquare className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {event.status === "DRAFT" && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                          onClick={() => handleOpenDelete(event)}
                          disabled={processingEventId === String(event.id)}
                        >
                          {processingEventId === String(event.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <Suspense fallback={<div className="px-6 text-gray-500">Đang tải...</div>}>
        {isCreateModalOpen && partnerId && (
          <CreateEventModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => reloadPartnerEvents({ page: 1, size: 20 })}
            partnerId={String(partnerId)}
          />
        )}

        {isDetailOpen && selectedEventId && (
          <ViewDetailEvent
            eventId={String(selectedEventId)}
            open={isDetailOpen}
            onClose={handleCloseDetail}
          />
        )}
      </Suspense>

      <Dialog open={!!topUpEvent} onOpenChange={(open) => !open && handleCloseTopUp()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Nạp coin cho sự kiện
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-gray-600">
              Sự kiện:{" "}
              <span className="font-semibold text-gray-800">
                {topUpEvent?.title ?? topUpEvent?.id ?? "N/A"}
              </span>
            </p>
            <Input
              type="number"
              min={1}
              placeholder="Nhập số coin muốn nạp"
              value={topUpAmount}
              onChange={(event) => setTopUpAmount(event.target.value)}
              disabled={isFunding}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseTopUp} disabled={isFunding}>
              Hủy
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleConfirmTopUp}
              disabled={isFunding}
            >
              {isFunding ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang nạp...
                </span>
              ) : (
                "Xác nhận nạp coin"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Suspense fallback={null}>
        {isCheckinModalOpen && currentCheckinEvent && (
          <CheckinPhoneNumberDialog
            open={isCheckinModalOpen}
            event={currentCheckinEvent}
            onClose={closeCheckinModal}
            onSubmit={handleCheckinSubmit}
            submitting={submittingCheckin}
          />
        )}
      </Suspense>

      <Dialog
        open={!!deleteEventTarget}
        onOpenChange={(open) => {
          if (!open) handleCloseDelete();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Xóa sự kiện?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa sự kiện{" "}
            <span className="font-semibold text-gray-800">
              “{deleteEventTarget?.title ?? deleteEventTarget?.id}”
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseDelete}
              disabled={isDeletingEvent}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeletingEvent}
            >
              {isDeletingEvent ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xóa...
                </span>
              ) : (
                "Xác nhận xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

