import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import type { EventFeedbackListProps } from "@/features/events/types/events";

export default function EventFeedbackList({
  feedbacks,
  loadingFeedbacks,
  currentStudentId,
}: EventFeedbackListProps) {
  return (
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
            {loadingFeedbacks
              ? "Đang tải phản hồi..."
              : `Có ${feedbacks.length} phản hồi`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingFeedbacks ? (
            <p className="text-gray-500">Vui lòng chờ...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-gray-500">Chưa có phản hồi nào.</p>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((fb, idx) => {
                const isMyFeedback =
                  currentStudentId !== null &&
                  String(fb.studentId) === currentStudentId;
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
                        <p
                          className={`text-sm font-semibold ${
                            isMyFeedback ? "text-blue-800" : "text-gray-800"
                          }`}
                        >
                          {fb.studentName || "Người dùng ẩn danh"}
                        </p>
                        {isMyFeedback && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            Phản hồi của bạn
                          </Badge>
                        )}
                      </div>
                      {sentiment && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${sentimentClass}`}
                        >
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
                      <p
                        className={`whitespace-pre-wrap ${
                          isMyFeedback ? "text-blue-900" : "text-gray-700"
                        }`}
                      >
                        {fb.comments}
                      </p>
                    )}
                    {fb.createdAt && (
                      <p
                        className={`text-xs mt-1 ${
                          isMyFeedback ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
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
  );
}


