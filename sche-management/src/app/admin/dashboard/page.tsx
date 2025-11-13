"use client";

import { useEffect, useState, useMemo } from "react";
import { useProducts } from "@/features/products/hooks/useProducts";
import OverviewCards from "@/components/admin/dashboard/OverviewCards";
import RedeemAnalytics from "@/components/admin/dashboard/RedeemAnalytics";
import ProductTables from "@/components/admin/dashboard/ProductTables";
import { ProductType } from "@/features/products/types/product";

type ProductTypeCounts = { [key in ProductType]?: number };
interface TopRedeemedProduct {
  id: string;
  type: ProductType;
  title: string;
  description: string;
  unitCost: number;
  currency: "COIN";
  totalStock: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

const initialRedeemData = [
  { time: "T.1", value: 15 },
  { time: "T.2", value: 30 },
  { time: "T.3", value: 45 },
  { time: "T.4", value: 60 },
  { time: "T.5", value: 75 },
];

export default function Dashboard() {
  const {
    overviewAnalytics,
    loadOverviewAnalytics,
    loadingOverview,
    topRedeemed,
    loadTopRedeemed,
    loadingTopRedeemed,
    lowStock,
    loadLowStock,
    loadingLowStock,
    redeemStatistics,
    loadRedeemStatistics,
  } = useProducts();

  const [redeemData] = useState(initialRedeemData);

  // Load tất cả dữ liệu analytics/stats khi mount
  useEffect(() => {
    loadOverviewAnalytics();
    loadTopRedeemed();
    loadLowStock();
    loadRedeemStatistics();
  }, [
    loadOverviewAnalytics,
    loadTopRedeemed,
    loadLowStock,
    loadRedeemStatistics,
  ]);

  // --- Tính toán dữ liệu cho Pie Chart ---
  const totalProducts = overviewAnalytics?.totalProducts ?? 0;
  const totalRedeems = overviewAnalytics?.totalRedeemed ?? 0;
  const totalCoinsSpent = redeemStatistics?.totalCoinsSpent ?? 0;
  const avgRedeemValue =
    totalRedeems > 0 ? Math.round(totalCoinsSpent / totalRedeems) : 0;
  const avgRedeemPerStudent = overviewAnalytics?.averageRedeemPerStudent ?? 0;
  const mostActivePartner = overviewAnalytics?.mostActivePartner ?? "N/A";

  const pieData = useMemo(() => {
    const typedTopRedeemed = topRedeemed as TopRedeemedProduct[];

    const counts = typedTopRedeemed.reduce(
      (acc: ProductTypeCounts, product) => {
        acc[product.type] = (acc[product.type] || 0) + 1;
        return acc;
      },
      {} as ProductTypeCounts
    );

    const productTypeColors: Record<ProductType, string> = {
      VOUCHER: "#3b82f6", // blue
      MERCH: "#22c55e", // green
      SERVICE: "#f59e0b", // amber
      GIFT: "#8b5cf6", // violet
    };

    return Object.entries(counts).map(([type, count]) => ({
      name: type,
      value: count as number,
      color: productTypeColors[type as ProductType],
    }));
  }, [topRedeemed]);

  const cardData = {
    totalProducts,
    totalRedeems,
    totalCoinsSpent,
    avgRedeemValue,
    avgRedeemPerStudent,
    mostActivePartner,
  };

  const loading = {
    loadingOverview,
    loadingTopRedeemed,
    loadingLowStock,
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Quản lý Sản phẩm & Đổi thưởng
      </h1>
      <p className="text-gray-500">
        Theo dõi tổng quan, hoạt động đổi thưởng và tình trạng tồn kho hệ thống
      </p>

      <OverviewCards data={cardData} loading={loading.loadingOverview} />

      <RedeemAnalytics
        redeemData={redeemData}
        pieData={pieData}
        totalProducts={totalProducts}
      />

      <ProductTables
        topRedeemed={topRedeemed}
        lowStock={lowStock}
        mostActivePartner={mostActivePartner}
        loading={loading}
      />
    </div>
  );
}
