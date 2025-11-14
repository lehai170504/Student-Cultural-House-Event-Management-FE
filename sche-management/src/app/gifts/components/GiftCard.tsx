"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Star, AlertTriangle } from "lucide-react";
import type { Reward } from "../types";
import { CATEGORY_BADGE } from "../types";

interface GiftCardProps {
  reward: Reward;
  index: number;
  userPoints: number;
  isTopProduct: boolean;
  isLowStock: boolean;
  onOpenDetails: (id: string) => void;
}

export default function GiftCard({
  reward,
  index,
  userPoints,
  isTopProduct,
  isLowStock,
  onOpenDetails,
}: GiftCardProps) {
  const canRedeem = reward.inStock && userPoints >= reward.points;
  const categoryBadge = CATEGORY_BADGE[reward.category];

  return (
    <div
      className={`group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fadeInUp ${
        canRedeem 
          ? "bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300" 
          : "bg-white border border-orange-100"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={reward.image}
          alt={reward.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isTopProduct && (
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg backdrop-blur-sm border-0 flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                <span className="font-semibold">Phổ biến</span>
              </Badge>
            )}
            {isLowStock && (
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg backdrop-blur-sm border-0 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 fill-white" />
                <span className="font-semibold">Sắp hết hàng</span>
              </Badge>
            )}
          </div>
          <Badge className="bg-white/90 text-foreground shadow-md backdrop-blur-sm border-0">
            {categoryBadge}
          </Badge>
        </div>

        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md flex items-center gap-1">
          <Zap className="w-4 h-4 text-orange-500" />
          <span className="font-semibold text-foreground text-sm">
            {reward.points.toLocaleString("vi-VN")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {reward.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {reward.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{reward.inStock ? `Còn ${reward.stock}` : "Hết quà"}</span>
          </div>

          {!reward.inStock ? (
            <Button
              size="sm"
              className="rounded-xl transition-all duration-300 bg-muted text-muted-foreground cursor-not-allowed"
              disabled
            >
              Hết hàng
            </Button>
          ) : (
            <Button
              size="sm"
              className="rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md hover:shadow-lg hover:scale-105"
              onClick={() => onOpenDetails(reward.id)}
            >
              Đổi ngay
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

