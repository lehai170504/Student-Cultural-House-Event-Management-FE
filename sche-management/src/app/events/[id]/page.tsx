"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEvents } from "@/features/events/hooks/useEvents";
import type { Event, EventFeedbackResponse } from "@/features/events/types/events";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { eventService } from "@/features/events/services/eventService";
import { studentService } from "@/features/students/services/studentService";
import EventDetailHeader from "./components/EventDetailHeader";
import EventDetailInfo from "./components/EventDetailInfo";
import EventInfoCards from "./components/EventInfoCards";
import EventBudgetCards from "./components/EventBudgetCards";
import EventFeedbackForm from "./components/EventFeedbackForm";
import EventFeedbackList from "./components/EventFeedbackList";
import EventDetailSkeleton from "./components/EventDetailSkeleton";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const eventId = Array.isArray(id) ? id?.[0] : id ?? null;

  const {
    detail,
    loadDetail,
    loadingDetail,
    registerForEventByStudent,
    registering,
    sendFeedbackForEvent,
    updateFeedbackForEvent,
    deleteFeedbackForEvent,
    sendingFeedback,
    updatingFeedback,
    deletingFeedback,
  } = useEvents();

  // Feedback form state (hooks must be before any conditional returns)
  const [rating, setRating] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [hasRegistered, setHasRegistered] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<EventFeedbackResponse[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<boolean>(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);

  const loadFeedbacks = useCallback(async () => {
    if (!eventId) return;
    try {
      setLoadingFeedbacks(true);
      const list = await eventService.getFeedbacks(eventId);
      setFeedbacks(list);
    } catch (e) {
      setFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  }, [eventId]);

  const checkRegistration = useCallback(async () => {
    if (!eventId) return;
    try {
      const list = await studentService.getMyEvents({
        page: 1,
        size: 1000,
      });
      const found = list.some((e: any) => String(e?.id) === String(eventId));
      setHasRegistered(found);
    } catch (e) {
      setHasRegistered(false);
    }
  }, [eventId]);

  const loadCurrentStudent = useCallback(async () => {
    try {
      const profile = await studentService.getProfile();
      if (profile?.id) {
        setCurrentStudentId(String(profile.id));
      } else {
        setCurrentStudentId(null);
      }
    } catch (e) {
      setCurrentStudentId(null);
    }
  }, []);

  useEffect(() => {
    if (!eventId) return;
    loadDetail(eventId);
    checkRegistration();
    loadCurrentStudent();
    loadFeedbacks();
  }, [eventId, loadDetail, checkRegistration, loadCurrentStudent, loadFeedbacks]);

  if (!detail) {
    return loadingDetail ? (
      <EventDetailSkeleton />
    ) : (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Không tìm thấy sự kiện.</p>
      </main>
    );
  }

  const event: Event = detail;
  const startDate = new Date(event.startTime).toLocaleString();
  const endDate = new Date(event.endTime).toLocaleString();
  const maxAttendees = event.maxAttendees ?? 0;

  const handleRegister = async () => {
    if (!detail) return;

    if (!currentStudentId) {
      toast.error("Vui lòng đăng nhập để đăng ký sự kiện.");
      return;
    }

    try {
      await registerForEventByStudent(detail.id, currentStudentId);
      setHasRegistered(true);
      await checkRegistration();

      // Thông báo thành công bằng Sonner
      toast.success("Đăng ký thành công!");
    } catch (err: any) {
      toast.error(err?.message || "Đăng ký thất bại!");
    }
  };
  const handleGoBack = () => {
    router.back();
  };

  const handleGoToFeedback = () => {
    const el = document.getElementById("feedback-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;
    if (!rating) {
      toast.error("Vui lòng chọn mức đánh giá (1-5)");
      return;
    }
    try {
      if (editingFeedbackId) {
        // Update existing feedback
        await updateFeedbackForEvent(editingFeedbackId, {
          rating: Number(rating),
          comments,
        });
        toast.success("Cập nhật phản hồi thành công!");
        setEditingFeedbackId(null);
      } else {
        // Create new feedback
        await sendFeedbackForEvent(detail.id, {
          rating: Number(rating),
          comments,
        });
        toast.success("Gửi phản hồi thành công!");
      }
      setRating("");
      setComments("");
      await loadFeedbacks();
    } catch (err: any) {
      toast.error(err?.message || (editingFeedbackId ? "Cập nhật phản hồi thất bại!" : "Gửi phản hồi thất bại!"));
    }
  };

  const handleEditFeedback = (feedback: EventFeedbackResponse) => {
    setEditingFeedbackId(feedback.id);
    setRating(String(feedback.rating));
    setComments(feedback.comments || "");
    // Scroll to feedback form
    setTimeout(() => {
      const el = document.getElementById("feedback-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingFeedbackId(null);
    setRating("");
    setComments("");
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      await deleteFeedbackForEvent(feedbackId);
      toast.success("Xóa phản hồi thành công!");
      await loadFeedbacks();
      // Nếu đang edit feedback bị xóa, reset form
      if (editingFeedbackId === feedbackId) {
        setEditingFeedbackId(null);
        setRating("");
        setComments("");
      }
    } catch (err: any) {
      toast.error(err?.message || "Xóa phản hồi thất bại!");
    }
  };

  const handleRatingChange = (rating: string) => {
    setRating(rating);
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value);
  };

  // Check if current student has already submitted feedback
  const hasSubmittedFeedback = currentStudentId
    ? feedbacks.some(
        (fb) => String(fb.studentId) === String(currentStudentId)
      )
    : false;

  // Show feedback form when:
  // 1. Event status is FINALIZED
  // 2. User has registered for the event
  // 3. Either: user hasn't submitted feedback yet OR user is editing their feedback
  const shouldShowFeedbackForm =
    event.status === "FINALIZED" &&
    hasRegistered &&
    (!hasSubmittedFeedback || editingFeedbackId !== null);

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <EventDetailHeader
        status={event.status}
        hasRegistered={hasRegistered}
        registering={registering}
        startTime={event.startTime}
        onRegister={handleRegister}
        onGoToFeedback={handleGoToFeedback}
        onGoBack={handleGoBack}
        hasSubmittedFeedback={hasSubmittedFeedback}
      />

      {/* Event Info */}
      <section className="container mx-auto px-6 space-y-8">
        <EventDetailInfo event={event} />

        <EventInfoCards
          event={event}
          startDate={startDate}
          endDate={endDate}
          maxAttendees={maxAttendees}
        />

        <EventBudgetCards event={event} />

        {/* Created At */}
        <motion.p
          className="text-gray-400 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Ngày tạo: {new Date(event.createdAt).toLocaleString()}
        </motion.p>

        {/* Feedback Form - only when FINALIZED, registered, and not yet submitted or editing */}
        {shouldShowFeedbackForm && (
          <EventFeedbackForm
            rating={rating}
            comments={comments}
            sendingFeedback={sendingFeedback || updatingFeedback}
            onRatingChange={handleRatingChange}
            onCommentsChange={handleCommentsChange}
            onSubmit={handleSubmitFeedback}
            isEditMode={editingFeedbackId !== null}
            onCancel={handleCancelEdit}
          />
        )}

        {/* Feedback list */}
        <EventFeedbackList
          feedbacks={feedbacks}
          loadingFeedbacks={loadingFeedbacks}
          currentStudentId={currentStudentId}
          onEdit={handleEditFeedback}
          onDelete={handleDeleteFeedback}
          deletingFeedback={deletingFeedback}
        />
      </section>
    </main>
  );
}
