import { motion } from "framer-motion";
import type { EventDetailInfoProps } from "@/features/events/types/events";

export default function EventDetailInfo({ event }: EventDetailInfoProps) {
  return (
    <>
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
    </>
  );
}


