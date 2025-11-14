import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Star, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { EventFeedbackListProps, EventFeedbackResponse } from "@/features/events/types/events";

export interface EventFeedbackListPropsWithEdit extends EventFeedbackListProps {
  onEdit?: (feedback: EventFeedbackResponse) => void;
  onDelete?: (feedbackId: string) => void;
  deletingFeedback?: boolean;
}

export default function EventFeedbackList({
  feedbacks,
  loadingFeedbacks,
  currentStudentId,
  onEdit,
  onDelete,
  deletingFeedback = false,
}: EventFeedbackListPropsWithEdit) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);

  const handleDeleteClick = (feedbackId: string) => {
    setFeedbackToDelete(feedbackId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (feedbackToDelete && onDelete) {
      onDelete(feedbackToDelete);
      setDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setFeedbackToDelete(null);
  };
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
                      <div className="flex items-center gap-2">
                        {isMyFeedback && (
                          <div className="flex items-center gap-1">
                            {onEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(fb)}
                                className="h-7 px-2 text-xs"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Sửa
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(fb.id)}
                                disabled={deletingFeedback}
                                className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Xóa
                              </Button>
                            )}
                          </div>
                        )}
                        {sentiment && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${sentimentClass}`}
                          >
                            {sentiment}
                          </span>
                        )}
                      </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa phản hồi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletingFeedback}
            >
              {deletingFeedback ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}


