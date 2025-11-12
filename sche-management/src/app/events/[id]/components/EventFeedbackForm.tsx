"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface EventFeedbackFormProps {
  rating: string;
  comments: string;
  sendingFeedback: boolean;
  onRatingChange: (rating: string) => void;
  onCommentsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EventFeedbackForm({
  rating,
  comments,
  sendingFeedback,
  onRatingChange,
  onCommentsChange,
  onSubmit,
}: EventFeedbackFormProps) {
  return (
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
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="rating">Mức đánh giá</Label>
                <div id="rating" className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Đánh giá ${i} sao`}
                      onClick={() => onRatingChange(String(i))}
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
                  onChange={onCommentsChange}
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
  );
}


