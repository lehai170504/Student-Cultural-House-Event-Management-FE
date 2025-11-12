import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { motion } from "framer-motion";
import type { Event } from "@/features/events/types/events";

interface EventBudgetCardsProps {
  event: Event;
}

export default function EventBudgetCards({ event }: EventBudgetCardsProps) {
  const budgetItems = [
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
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {budgetItems.map((info, idx) => (
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
  );
}


