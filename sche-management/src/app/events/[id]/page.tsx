"use client";

import { useEffect } from "react";
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
import { Calendar, MapPin, ArrowLeft, Users, Coins } from "lucide-react";
import { useEvents } from "@/features/events/hooks/useEvents";
import type { Event } from "@/features/events/types/events";
import { motion } from "framer-motion";

export default function EventDetailPage() {
  const { id } = useParams();
  const eventId = parseInt(Array.isArray(id) ? id[0] : id || "0");
  const router = useRouter();

  const { detail, loadDetail, loadingDetail } = useEvents();

  useEffect(() => {
    if (eventId) loadDetail(eventId);
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
      case "UPCOMING":
        return "bg-blue-100 text-blue-700";
      case "ONGOING":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "SẮP DIỄN RA";
      case "ONGOING":
        return "ĐANG DIỄN RA";
      case "COMPLETED":
        return "ĐÃ KẾT THÚC";
      default:
        return "KHÔNG XÁC ĐỊNH";
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
      </section>
    </main>
  );
}
