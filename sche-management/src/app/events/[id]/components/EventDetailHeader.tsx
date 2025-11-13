import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getStatusColor, getStatusText } from "@/app/events/utils/eventUtils";
import type { EventDetailHeaderProps } from "@/features/events/types/events";

export default function EventDetailHeader({
  status,
  hasRegistered,
  registering,
  onRegister,
  onGoToFeedback,
  onGoBack,
}: EventDetailHeaderProps) {
  return (
    <motion.section
      className="relative flex flex-col md:flex-row items-center justify-between px-6 py-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-b-3xl shadow-md mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-white mb-4 md:mb-0 cursor-pointer"
        onClick={onGoBack}
      >
        <ArrowLeft className="h-5 w-5 cursor-pointer" /> Quay lại
      </Button>

      <Badge className={`${getStatusColor(status)} text-lg px-4 py-2`}>
        {getStatusText(status)}
      </Badge>

      {status === "ACTIVE" ? (
        hasRegistered ? (
          <Button
            disabled
            className="mt-4 bg-gray-300 text-gray-600 cursor-not-allowed"
          >
            Đã đăng ký
          </Button>
        ) : (
          <Button
            onClick={onRegister}
            disabled={registering}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
          >
            {registering ? "Đang đăng ký..." : "Đăng ký sự kiện"}
          </Button>
        )
      ) : null}
      {status === "FINISHED" ? (
        <Button
          onClick={onGoToFeedback}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Gửi feedback
        </Button>
      ) : null}
    </motion.section>
  );
}

