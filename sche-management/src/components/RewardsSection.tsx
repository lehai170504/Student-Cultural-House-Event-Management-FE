"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Gift,
  Star,
  Users,
  Clock,
  Zap,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product";

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  category: string;
  stock: number;
  popular: boolean;
  lowStock?: boolean;
}

const CATEGORY_BADGE: Record<string, string> = {
  voucher: "Voucher",
  gift: "Quà tặng",
};

// Map Product type to category badge
const mapProductTypeToCategory = (type: string): string => {
  switch (type) {
    case "VOUCHER":
      return "Voucher";
    case "GIFT":
      return "Quà tặng";
    default:
      return "Quà tặng";
  }
};

// Convert Product to Reward
const convertProductToReward = (
  product: Product,
  index: number,
  topProductIds?: Set<string>
): Reward => {
  return {
    id: product.id,
    name: product.title,
    description: product.description,
    points: product.unitCost,
    image:
      product.imageUrl || "https://via.placeholder.com/400x300?text=No+Image",
    category: mapProductTypeToCategory(product.type),
    stock: product.totalStock,
    popular: topProductIds?.has(product.id) || false, // Check if product is in top products
    lowStock: product.totalStock < 50, // Show "Sắp hết hàng" when stock is below 50
  };
};

export default function RewardsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Top selling products (bán chạy)
  const [topProductIds, setTopProductIds] = useState<Set<string>>(new Set());

  // Load top 3 products bán chạy từ API /products/top
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy danh sách top products từ API /products/top
      const topProducts = await productService.getTopRedeemed();

      // Lấy 3 products đầu tiên (bán chạy nhất)
      const top3ProductIds = topProducts.slice(0, 3).map((p) => p.id);

      // Lấy thông tin đầy đủ của 3 products này
      const productDetails = await Promise.all(
        top3ProductIds.map((productId) =>
          productService.getById(productId).catch(() => null)
        )
      );

      // Filter chỉ lấy products hợp lệ (active, có stock, và là GIFT hoặc VOUCHER)
      const validProducts = productDetails.filter(
        (p): p is Product =>
          p !== null &&
          p.isActive === true &&
          (p.type === "GIFT" || p.type === "VOUCHER") &&
          p.totalStock > 0
      );

      setProducts(validProducts);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Không tải được danh sách quà"
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load top selling products (phổ biến) từ API /products/top để đánh dấu badge
  const loadTopProducts = useCallback(async () => {
    try {
      const topProducts = await productService.getTopRedeemed();

      // API /products/top trả về format: [{ productId, totalRedeem, title, totalCoins }]
      // Lưu danh sách productIds của sản phẩm phổ biến để hiển thị badge
      const topIds = new Set(topProducts.map((p) => p.id));
      setTopProductIds(topIds);
    } catch (e: any) {
      // Nếu có lỗi, set empty set để không hiển thị badge "Phổ biến"
      setTopProductIds(new Set());
    }
  }, []);

  // Load products on mount
  useEffect(() => {
    loadProducts();
    loadTopProducts();
  }, [loadProducts, loadTopProducts]);

  // Convert products to rewards
  const rewards: Reward[] = useMemo(() => {
    return products.map((product, index) =>
      convertProductToReward(product, index, topProductIds)
    );
  }, [products, topProductIds]);
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-orange-50 via-amber-100/50 to-white overflow-hidden">
      {/* Decorative glowing circles */}
      <div className="absolute top-0 -right-20 w-[400px] h-[400px] bg-orange-300/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-amber-200/40 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-5 py-2 rounded-full mb-5 shadow-sm animate-fadeIn">
            <Gift className="w-5 h-5" />
            <span className="font-semibold tracking-wide">
              Phần thưởng hấp dẫn
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 bg-clip-text text-transparent">
            Đổi điểm lấy quà
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tích điểm từ các hoạt động và đổi lấy những phần quà hấp dẫn. Càng
            tham gia nhiều, càng có nhiều cơ hội nhận quà giá trị!
          </p>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: <Star className="w-6 h-6 text-yellow-500" />,
              title: "150+",
              subtitle: "Phần quà đa dạng",
              gradient: "from-amber-100 to-orange-50",
            },
            {
              icon: <Users className="w-6 h-6 text-blue-500" />,
              title: "2,500+",
              subtitle: "Thành viên tích cực",
              gradient: "from-blue-100 to-teal-50",
            },
            {
              icon: <Clock className="w-6 h-6 text-green-500" />,
              title: "24/7",
              subtitle: "Đổi quà mọi lúc",
              gradient: "from-green-100 to-emerald-50",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 bg-gradient-to-br ${item.gradient} shadow-md hover:shadow-xl border border-white/40 transition-all duration-300 hover:-translate-y-2`}
            >
              <div className="flex items-center justify-between mb-3">
                {item.icon}
                <TrendingUp className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {item.title}
              </div>
              <p className="text-muted-foreground font-medium">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Rewards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <span className="ml-3 text-gray-600">
                Đang tải danh sách quà...
              </span>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-16 text-red-600">
              <p className="mb-4">{error}</p>
              <Button onClick={loadProducts} variant="outline">
                Thử lại
              </Button>
            </div>
          ) : rewards.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              Không có quà nào
            </div>
          ) : (
            rewards.map((reward, index) => (
              <div
                key={reward.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-orange-100 transition-all duration-500 hover:-translate-y-2 animate-fadeInUp"
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

                  <div className="absolute top-4 left-4 flex flex-row gap-2 flex-wrap">
                    {reward.popular && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md border-none px-3 py-1.5 text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" /> Phổ biến
                      </Badge>
                    )}
                    {reward.lowStock && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-400 text-white shadow-md border-none px-3 py-1.5 text-sm font-semibold flex items-center gap-1">
                        Sắp hết hàng
                      </Badge>
                    )}
                  </div>

                  <Badge className="absolute top-4 right-4 bg-white/90 text-foreground shadow-md backdrop-blur-sm border-0">
                    {reward.category}
                  </Badge>

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
                      <span>Còn {reward.stock}</span>
                    </div>

                    {reward.stock === 0 ? (
                      <Button
                        size="sm"
                        className="rounded-xl transition-all duration-300 bg-muted text-muted-foreground cursor-not-allowed"
                        disabled
                      >
                        Hết hàng
                      </Button>
                    ) : (
                      <Link href="/gifts">
                        <Button
                          size="sm"
                          className="rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md hover:shadow-lg hover:scale-105"
                        >
                          Đổi ngay
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/gifts">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 hover:from-orange-600 hover:to-amber-400 text-white px-10 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Gift className="w-5 h-5 mr-2" />
              Xem tất cả phần quà
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
