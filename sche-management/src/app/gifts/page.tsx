"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Gift, Search, Filter, Star, ChevronLeft, ChevronRight, Zap, Clock, Loader2 } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import { useProducts } from "@/features/products/hooks/useProducts";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product";
import axiosInstance from "@/config/axiosInstance";

type RewardCategory = "voucher" | "gift";

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  category: RewardCategory;
  inStock: boolean;
  createdAt: string; // ISO date string for sorting newest
  stock: number; // totalStock from API
}

const CATEGORY_LABEL: Record<RewardCategory, string> = {
  voucher: "🎫 Voucher ăn uống",
  gift: "🎁 Quà tặng",
};

const CATEGORY_BADGE: Record<RewardCategory, string> = {
  voucher: "Voucher",
  gift: "Quà tặng",
};

// Map Product type to RewardCategory
const mapProductTypeToCategory = (type: string): RewardCategory => {
  switch (type) {
    case "VOUCHER":
      return "voucher";
    case "GIFT":
      return "gift";
    default:
      return "gift"; // Default to gift for unknown types
  }
};

// Convert Product to Reward
const convertProductToReward = (product: Product): Reward => {
  return {
    id: product.id,
    name: product.title,
    description: product.description,
    points: product.unitCost,
    image: product.imageUrl || "https://via.placeholder.com/400x300?text=No+Image",
    category: mapProductTypeToCategory(product.type),
    inStock: product.isActive && product.totalStock > 0,
    createdAt: product.createdAt,
    stock: product.totalStock,
  };
};

export default function GiftsPage() {
  // User points from wallet
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(true);
  
  // Products from API
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI & Query states
  const [query, setQuery] = useState<string>("");
  // Default: show all (both categories unchecked = show all)
  const [selectedCategories, setSelectedCategories] = useState<Record<RewardCategory, boolean>>({
    voucher: false,
    gift: false,
  });
  const [sortBy, setSortBy] = useState<"pointsAsc" | "newest">("pointsAsc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(9);
  const [openRewardId, setOpenRewardId] = useState<string | null>(null);

  // Load user wallet balance
  const loadUserPoints = useCallback(async () => {
    try {
      setLoadingPoints(true);
      const meRes = await axiosInstance.get<any>("/me");
      const meData = meRes?.data?.data ?? meRes?.data ?? {};
      const walletId = meData?.walletId;
      
      if (walletId) {
        const wRes = await axiosInstance.get<any>(`/wallets/${walletId}`);
        const wData = wRes?.data?.data ?? wRes?.data ?? {};
        setUserPoints(Number(wData?.balance ?? 0));
      } else {
        setUserPoints(0);
      }
    } catch (e: any) {
      setUserPoints(0);
    } finally {
      setLoadingPoints(false);
    }
  }, []);

  // Load products from API
  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      setError(null);
      
      // Load both GIFT and VOUCHER products
      const [giftResponse, voucherResponse] = await Promise.all([
        productService.getAll({
          category: "GIFT",
          isActive: true,
          sortBy: "createdAt",
          order: "desc",
          limit: 100,
          offset: 0,
        }),
        productService.getAll({
          category: "VOUCHER",
          isActive: true,
          sortBy: "createdAt",
          order: "desc",
          limit: 100,
          offset: 0,
        }),
      ]);

      // Helper function to extract products from response
      const extractProducts = (response: any): Product[] => {
        if (!response) return [];
        
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else if (Array.isArray(response)) {
          return response;
        } else {
          const possibleData = (response as any)?.data?.data || 
                               (response as any)?.content || 
                               (response as any)?.items ||
                               (response as any)?.products;
          if (Array.isArray(possibleData)) {
            return possibleData;
          }
          // Last resort: check if response itself contains array values
          const responseValues = Object.values(response);
          for (const value of responseValues) {
            if (Array.isArray(value) && value.length > 0 && (value[0] as any)?.id) {
              return value as Product[];
            }
          }
        }
        return [];
      };

      // Extract products from both responses
      const giftProducts = extractProducts(giftResponse);
      const voucherProducts = extractProducts(voucherResponse);

      // Merge and remove duplicates (in case API returns duplicates)
      const allProducts = [...giftProducts, ...voucherProducts];
      const uniqueProducts = allProducts.filter((p, index, self) => 
        index === self.findIndex((product) => product.id === p.id)
      );

      // Filter only active products (double-check)
      const activeProducts = uniqueProducts.filter((p: Product) => 
        p && p.isActive === true && (p.type === "GIFT" || p.type === "VOUCHER")
      );

      setProducts(activeProducts);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Không tải được danh sách quà");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadUserPoints();
    loadProducts();
  }, [loadUserPoints, loadProducts]);

  // Convert products to rewards
  const ALL_REWARDS: Reward[] = useMemo(() => {
    return products.map(convertProductToReward);
  }, [products]);

  const filteredSortedRewards = useMemo(() => {
    const activeCats = Object.entries(selectedCategories)
      .filter(([, v]) => v)
      .map(([k]) => k as RewardCategory);

    // If no categories selected, show all (isAllSelected = true)
    const shouldShowAll = activeCats.length === 0;

    let list = ALL_REWARDS.filter((r) => {
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase());
      // If shouldShowAll is true, show all categories; otherwise filter by selected categories
      const matchesCat = shouldShowAll ? true : activeCats.includes(r.category);
      return matchesQuery && matchesCat;
    });

    if (sortBy === "pointsAsc") {
      list = list.sort((a, b) => a.points - b.points);
    } else {
      list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [ALL_REWARDS, query, selectedCategories, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredSortedRewards.length / pageSize) || 1;
  const start = (currentPage - 1) * pageSize;
  const current = filteredSortedRewards.slice(start, start + pageSize);

  const toggleCategory = (key: RewardCategory, checked: boolean) => {
    setCurrentPage(1);
    // When selecting a specific category, uncheck all others
    if (checked) {
      setSelectedCategories({
        voucher: key === "voucher",
        gift: key === "gift",
      });
    } else {
      // If unchecking, set all to false (show all)
      setSelectedCategories({
        voucher: false,
        gift: false,
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setCurrentPage(1);
    if (checked) {
      // Select all = uncheck all categories to show everything
      setSelectedCategories({
        voucher: false,
        gift: false,
      });
    }
  };

  const isAllSelected = !selectedCategories.voucher && !selectedCategories.gift;

  const openDetails = (id: string) => setOpenRewardId(id);
  const closeDetails = () => setOpenRewardId(null);

  const activeReward = useMemo(() => ALL_REWARDS.find((r) => r.id === openRewardId) || null, [ALL_REWARDS, openRewardId]);
  const similarRewards = useMemo(() => {
    if (!activeReward) return [] as Reward[];
    return ALL_REWARDS.filter((r) => r.category === activeReward.category && r.id !== activeReward.id).slice(0, 3);
  }, [ALL_REWARDS, activeReward]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <PublicNavbar />
      <section className="py-10 mt-20 bg-gradient-to-r from-orange-50 to-white border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gift className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Khu vực đổi quà</h1>
          </div>
          <p className="text-center text-gray-600">
            {loadingPoints ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải...
              </span>
            ) : (
              <>Bạn đang có <span className="font-semibold text-gray-900">{userPoints.toLocaleString("vi-VN")}</span> điểm</>
            )}
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Tìm theo tên quà..."
                  className="pl-10 pr-4 py-3 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Sort & Filter */}
            <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
              <Select value={sortBy} onValueChange={(v) => { setSortBy(v as any); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[190px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pointsAsc">Ít điểm → Nhiều điểm</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 w-full sm:w-auto"><Filter className="h-4 w-4" />Bộ lọc</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuCheckboxItem
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  >
                    Tất cả
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedCategories.voucher}
                    onCheckedChange={(c) => toggleCategory("voucher", Boolean(c))}
                  >
                    {CATEGORY_LABEL.voucher}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedCategories.gift}
                    onCheckedChange={(c) => toggleCategory("gift", Boolean(c))}
                  >
                    {CATEGORY_LABEL.gift}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Reward Grid */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6">
          {loadingProducts ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <span className="ml-3 text-gray-600">Đang tải danh sách quà...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-600">
              <p className="mb-4">{error}</p>
              <Button onClick={loadProducts} variant="outline">
                Thử lại
              </Button>
            </div>
          ) : current.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {current.map((r, index) => {
                const canRedeem = r.inStock && userPoints >= r.points;
                const needMore = Math.max(0, r.points - userPoints);
                const categoryBadge = CATEGORY_BADGE[r.category];
                return (
                  <div
                    key={r.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-orange-100 transition-all duration-500 hover:-translate-y-2 animate-fadeInUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      <Badge className="absolute top-4 right-4 bg-white/90 text-foreground shadow-md backdrop-blur-sm border-0">
                        {categoryBadge}
                      </Badge>

                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md flex items-center gap-1">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-foreground text-sm">
                          {r.points.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {r.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {r.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{r.inStock ? `Còn ${r.stock}` : "Hết quà"}</span>
                        </div>

                        {!r.inStock ? (
                          <Button
                            size="sm"
                            className="rounded-xl transition-all duration-300 bg-muted text-muted-foreground cursor-not-allowed"
                            disabled
                          >
                            Hết hàng
                          </Button>
                        ) : !canRedeem ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  className="rounded-xl transition-all duration-300 bg-muted text-muted-foreground cursor-not-allowed"
                                  disabled
                                >
                                  Cần {needMore} điểm
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Bạn cần thêm {needMore} điểm nữa để đổi quà này</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Button
                            size="sm"
                            className="rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md hover:shadow-lg hover:scale-105"
                            onClick={() => openDetails(r.id)}
                          >
                            Đổi ngay
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !loadingProducts && ALL_REWARDS.length === 0 ? (
            <div className="text-center py-16 text-gray-500">Không có quà nào</div>
          ) : !loadingProducts ? (
            <div className="text-center py-16 text-gray-500">Không tìm thấy quà phù hợp</div>
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Trước
              </Button>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "default" : "outline"}
                    className={currentPage === page ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Sau <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Reward Details Modal */}
      <Dialog open={Boolean(activeReward)} onOpenChange={(o) => !o && closeDetails()}>
        <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-3xl p-0 overflow-hidden">
          {activeReward && (
            <div className="grid md:grid-cols-2">
              <div className="relative h-56 md:h-full min-h-[260px]">
                <Image src={activeReward.image} alt={activeReward.name} fill className="object-cover" />
              </div>
              <div className="p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                    {activeReward.name}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-gray-600 mt-2 mb-4">{activeReward.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-orange-500 text-white">{activeReward.points.toLocaleString("vi-VN")} điểm</Badge>
                  {activeReward.inStock ? (
                    <Badge className="bg-green-500 text-white">Còn {activeReward.stock}</Badge>
                  ) : (
                    <Badge className="bg-gray-400 text-white">Hết quà</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Xác nhận đổi quà</Button>
                  <Button variant="outline" asChild>
                    <Link href="#">Quy định đổi quà</Link>
                  </Button>
                </div>

                {similarRewards.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Gợi ý quà tương tự</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {similarRewards.map((s) => (
                        <div key={s.id} className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer" onClick={() => openDetails(s.id)}>
                          <div className="relative h-24">
                            <Image src={s.image} alt={s.name} fill className="object-cover" />
                          </div>
                          <div className="p-2">
                            <p className="text-sm font-medium line-clamp-1">{s.name}</p>
                            <span className="text-xs text-gray-600">{s.points.toLocaleString("vi-VN")} điểm</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}


