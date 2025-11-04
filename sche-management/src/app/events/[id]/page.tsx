"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, MapPin, ArrowLeft, Users, Coins, Star } from "lucide-react";
import { useEvents } from "@/features/events/hooks/useEvents";
import type { Event } from "@/features/events/types/events";
import { motion } from "framer-motion";

// Import Sonner Toast
import { toast } from "sonner";
import axiosInstance from "@/config/axiosInstance";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EventDetailPage() {
  const { id } = useParams();
  const eventId = parseInt(Array.isArray(id) ? id[0] : id || "0");
  const router = useRouter();

  const {
    detail,
    loadDetail,
    loadingDetail,
    registerForEventByStudent,
    registering,
    sendFeedbackForEvent,
    sendingFeedback,
  } = useEvents();

  // Feedback form state (hooks must be before any conditional returns)
  const [rating, setRating] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [hasRegistered, setHasRegistered] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<boolean>(false);
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (eventId) {
      loadDetail(eventId);
      // Check if current student has registered this event
      (async () => {
        try {
          const res = await axiosInstance.get<any>("/students/me/events", {
            params: { page: 1, size: 1000 },
          });
          const payload = res?.data;
          const list: any[] = (payload?.data && Array.isArray(payload.data))
            ? payload.data
            : Array.isArray(payload)
            ? payload
            : [];
          const found = list.some((e: any) => Number(e?.id) === Number(eventId));
          setHasRegistered(found);
        } catch (e) {
          // ignore check error
          setHasRegistered(false);
        }
      })();

      // Load current student profile to get studentId
      (async () => {
        try {
          const res = await axiosInstance.get<any>("/me");
          const apiData = res?.data?.data ?? res?.data;
          if (apiData?.id) {
            setCurrentStudentId(Number(apiData.id));
          }
        } catch (e) {
          // ignore error, user might not be logged in
        }
      })();

      // Load feedback list for this event
      (async () => {
        try {
          setLoadingFeedbacks(true);
          const res = await axiosInstance.get<any>(`/events/${eventId}/feedback`);
          const payload = res?.data;
          const list: any[] = (payload?.data && Array.isArray(payload.data))
            ? payload.data
            : Array.isArray(payload)
            ? payload
            : [];
          setFeedbacks(list);
        } catch (e) {
          setFeedbacks([]);
        } finally {
          setLoadingFeedbacks(false);
        }
      })();
    }
  }, [eventId, loadDetail]);

  if (loadingDetail || !detail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">
          Đang tải chi tiết sự kiện...
        </p>
      </main>
    );
  }

  const event: Event = detail;
  const startDate = new Date(event.startTime).toLocaleString();
  const endDate = new Date(event.endTime).toLocaleString();
  const maxAttendees = event.maxAttendees ?? 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-blue-100 text-blue-700";
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "FINISHED":
        return "bg-gray-100 text-gray-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "NHÁP";
      case "ACTIVE":
        return "ĐANG DIỄN RA";
      case "FINISHED":
        return "ĐÃ KẾT THÚC";
      case "CANCELLED":
        return "ĐÃ HỦY";
      default:
        return "KHÔNG XÁC ĐỊNH";
    }
  };

  const handleRegister = async () => {
    if (!detail) return;

    try {
      const studentId = 123; // Giả sử studentId lấy từ context/session
      await registerForEventByStudent(detail.id, studentId);
      setHasRegistered(true);

      // Thông báo thành công bằng Sonner
      toast.success("Đăng ký thành công!");
    } catch (err: any) {
      toast.error(err?.message || "Đăng ký thất bại!");
    }
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
      await sendFeedbackForEvent(detail.id, {
        rating: Number(rating),
        comments,
      });
      toast.success("Gửi phản hồi thành công!");
      setRating("");
      setComments("");
    } catch (err: any) {
      toast.error(err?.message || "Gửi phản hồi thất bại!");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <motion.section
        className="relative flex flex-col md:flex-row items-center justify-between px-6 py-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-b-3xl shadow-md mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-white mb-4 md:mb-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" /> Quay lại
        </Button>

        <Badge className={`${getStatusColor(event.status)} text-lg px-4 py-2`}>
          {getStatusText(event.status)}
        </Badge>

        {event.status === "ACTIVE" ? (
          hasRegistered ? (
            <Button
              disabled
              className="mt-4 bg-gray-300 text-gray-600 cursor-not-allowed"
            >
              Đã đăng ký
            </Button>
          ) : (
            <Button
              onClick={handleRegister}
              disabled={registering}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {registering ? "Đang đăng ký..." : "Đăng ký sự kiện"}
            </Button>
          )
        ) : null}
        {event.status === "FINISHED" ? (
          <Button
            onClick={handleGoToFeedback}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Gửi feedback
          </Button>
        ) : null}
      </motion.section>

      {/* Event Info */}
      <section className="container mx-auto px-6 space-y-8">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {event.title}
        </motion.h1>

        <motion.p
          className="text-gray-600 text-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-semibold">Tổ chức bởi: </span>
          {event.partnerName}
        </motion.p>

        <motion.p
          className="text-gray-700 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {event.description}
        </motion.p>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            {
              icon: <Calendar className="h-6 w-6 text-indigo-500" />,
              title: "Thời gian",
              content: `${startDate} - ${endDate}`,
            },
            {
              icon: <MapPin className="h-6 w-6 text-pink-500" />,
              title: "Địa điểm",
              content: event.location,
            },
            {
              icon: <Users className="h-6 w-6 text-green-500" />,
              title: "Số lượng tối đa",
              content: maxAttendees,
            },
          ].map((info, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardHeader className="flex items-center gap-3">
                  {info.icon}
                  <CardTitle>{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{info.content}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Budget & Reward */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            {
              title: "Phí đăng ký",
              value: event.pointCostToRegister,
              color: "yellow",
            },
            {
              title: "Tổng điểm thưởng",
              value: event.totalRewardPoints,
              color: "purple",
            },
            {
              title: "Tổng ngân sách",
              value: event.totalBudgetCoin,
              color: "green",
            },
          ].map((info, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className={`text-center bg-${info.color}-50 border-none`}>
                <CardHeader>
                  <CardTitle>{info.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center gap-2">
                  <Coins className={`text-${info.color}-600 h-5 w-5`} />
                  <span className={`font-bold text-${info.color}-600 text-lg`}>
                    {info.value}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Created At */}
        <motion.p
          className="text-gray-400 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Ngày tạo: {new Date(event.createdAt).toLocaleString()}
        </motion.p>

        {/* Feedback Form - only when FINISHED */}
        {event.status === "FINISHED" && (
          <motion.div
            id="feedback-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Gửi phản hồi sự kiện</CardTitle>
                <CardDescription>
                  Vui lòng đánh giá trải nghiệm của bạn sau khi tham gia sự kiện.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="rating">Mức đánh giá</Label>
                      <div id="rating" className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            type="button"
                            aria-label={`Đánh giá ${i} sao`}
                            onClick={() => setRating(String(i))}
                            className="p-1"
                          >
                            <Star
                              className={
                                Number(rating) >= i
                                  ? "h-6 w-6 text-yellow-400 fill-yellow-400"
                                  : "h-6 w-6 text-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comments">Nhận xét</Label>
                      <Textarea
                        id="comments"
                        placeholder="Chia sẻ cảm nhận của bạn..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={sendingFeedback || !rating}>
                      {sendingFeedback ? "Đang gửi..." : "Gửi phản hồi"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Feedback list */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Phản hồi từ người tham gia</CardTitle>
              <CardDescription>
                {loadingFeedbacks ? "Đang tải phản hồi..." : `Có ${feedbacks.length} phản hồi`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFeedbacks ? (
                <p className="text-gray-500">Vui lòng chờ...</p>
              ) : feedbacks.length === 0 ? (
                <p className="text-gray-500">Chưa có phản hồi nào.</p>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((fb: any, idx: number) => {
                    const isMyFeedback = currentStudentId !== null && Number(fb.studentId) === Number(currentStudentId);
                    const sentiment = String(fb?.sentimentLabel || "").toUpperCase();
                    const sentimentClass =
                      sentiment === "POSITIVE"
                        ? "bg-green-100 text-green-700"
                        : sentiment === "NEGATIVE"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700";
                    return (
                      <div
                        key={fb.id ?? idx}
                        className={`border-b last:border-0 pb-4 last:pb-0 rounded-lg p-4 ${
                          isMyFeedback
                            ? "bg-blue-50 border-blue-200 border-2"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-semibold ${isMyFeedback ? "text-blue-800" : "text-gray-800"}`}>
                              {fb.studentName || "Người dùng ẩn danh"}
                            </p>
                            {isMyFeedback && (
                              <Badge className="bg-blue-500 text-white text-xs">Phản hồi của bạn</Badge>
                            )}
                          </div>
                          {sentiment && (
                            <span className={`text-xs px-2 py-0.5 rounded ${sentimentClass}`}>
                              {sentiment}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={
                                Number(fb.rating) >= i
                                  ? "h-4 w-4 text-yellow-400 fill-yellow-400"
                                  : "h-4 w-4 text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        {fb.comments && (
                          <p className={`whitespace-pre-wrap ${isMyFeedback ? "text-blue-900" : "text-gray-700"}`}>
                            {fb.comments}
                          </p>
                        )}
                        {fb.createdAt && (
                          <p className={`text-xs mt-1 ${isMyFeedback ? "text-blue-600" : "text-gray-400"}`}>
                            {new Date(fb.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}
