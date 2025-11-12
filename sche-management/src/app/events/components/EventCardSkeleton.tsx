import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface EventCardSkeletonProps {
  index: number;
}

export default function EventCardSkeleton({ index }: EventCardSkeletonProps) {
  return (
    <motion.div
      key={`skeleton-${index}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-3xl overflow-hidden shadow-md border border-orange-100"
    >
      <div className="relative h-60 bg-gray-200">
        <Skeleton className="absolute top-4 left-4 h-6 w-20" />
        <Skeleton className="absolute top-4 right-4 h-6 w-24" />
      </div>
      <div className="p-6 flex flex-col gap-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </motion.div>
  );
}

