import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { Event } from "@/features/events/types/events";

interface EventInfoCardsProps {
  event: Event;
  startDate: string;
  endDate: string;
  maxAttendees: number;
}

export default function EventInfoCards({
  event,
  startDate,
  endDate,
  maxAttendees,
}: EventInfoCardsProps) {
  const infoItems = [
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
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {infoItems.map((info, idx) => (
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
  );
}


