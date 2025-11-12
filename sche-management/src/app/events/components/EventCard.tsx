import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import type { Event } from "@/features/events/types/events";
import {
  getEventStatus,
  getStatusColor,
  getStatusText,
  formatDate,
  formatTime,
} from "../utils/eventUtils";

interface EventCardProps {
  event: Event;
  index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
  const status = getEventStatus(event);

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-orange-100 hover:border-orange-300 transition-all duration-500 cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/events/${event.id}`}>
        {/* Image section */}
        <div className="relative">
          {/* Category Badge */}
          {event.category && (
            <Badge className="absolute top-4 left-4 bg-orange-500 text-white backdrop-blur-sm border-0 shadow-md">
              {typeof event.category === "object" && event.category.name
                ? event.category.name
                : String(event.category)}
            </Badge>
          )}

          {/* Status Badge */}
          <Badge
            className={`absolute top-4 right-4 ${getStatusColor(status)} backdrop-blur-sm border`}
          >
            {getStatusText(status)}
          </Badge>
        </div>

        {/* Content section */}
        <div className="p-6">
          <h3 className="text-xl mt-8 font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-2 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>{formatDate(event.startTime)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </span>
            </div>
          </div>

          <Button className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2 transition-transform duration-300 group-hover:scale-[1.02] shadow-md">
            Xem chi tiết
            <ArrowRight className="w-4 h-4 cursor-pointer group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Link>
    </div>
  );
}

