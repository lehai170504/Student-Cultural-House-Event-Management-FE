"use client";

import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import { useInvoices } from "@/features/invoices/hooks/useInvoices";
import { toast } from "sonner";
import { useGiftsData } from "./hooks/useGiftsData";
import { convertProductToReward } from "./utils";
import type { Reward, RedeemedProduct } from "./types";
import GiftsSearchFilter from "./components/GiftsSearchFilter";
import GiftCard from "./components/GiftCard";
import GiftDetailDialog from "./components/GiftDetailDialog";
import SuccessDialog from "./components/SuccessDialog";
import GiftsPagination from "./components/GiftsPagination";

type RewardCategory = "voucher" | "gift";

export default function GiftsPage() {
  // Data hooks
  const {
    userPoints,
    loadingPoints,
    studentId,
    products,
    loadingProducts,
    error,
    topProductIds,
    loadUserPoints,
    loadProducts,
  } = useGiftsData();

  // Invoice hook
  const { createNewInvoice, saving: creatingInvoice, error: invoiceError } = useInvoices();

  // UI & Query states
  const [query, setQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<Record<RewardCategory, boolean>>({
    voucher: false,
    gift: false,
  });
  const [sortBy, setSortBy] = useState<"pointsAsc" | "pointsDesc" | "newest">("pointsAsc");
  const [pointsFilter, setPointsFilter] = useState<"all" | "0-100" | "100-500" | "500-1000" | "1000+">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(9);
  const [openRewardId, setOpenRewardId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [redeemedProduct, setRedeemedProduct] = useState<RedeemedProduct | null>(null);

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
      
      // Filter by points range
      let matchesPoints = true;
      if (pointsFilter !== "all") {
        switch (pointsFilter) {
          case "0-100":
            matchesPoints = r.points >= 0 && r.points <= 100;
            break;
          case "100-500":
            matchesPoints = r.points > 100 && r.points <= 500;
            break;
          case "500-1000":
            matchesPoints = r.points > 500 && r.points <= 1000;
            break;
          case "1000+":
            matchesPoints = r.points > 1000;
            break;
        }
      }
      
      return matchesQuery && matchesCat && matchesPoints;
    });

    // Sort
    if (sortBy === "pointsAsc") {
      list = list.sort((a, b) => a.points - b.points);
    } else if (sortBy === "pointsDesc") {
      list = list.sort((a, b) => b.points - a.points);
    } else {
      list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [ALL_REWARDS, query, selectedCategories, sortBy, pointsFilter]);

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

  const openDetails = (id: string) => {
    setOpenRewardId(id);
    setQuantity(1); // Reset quantity khi mở dialog mới
  };
  
  const closeDetails = () => {
    setOpenRewardId(null);
    setQuantity(1); // Reset quantity khi đóng dialog
  };

  const activeReward = useMemo(() => ALL_REWARDS.find((r) => r.id === openRewardId) || null, [ALL_REWARDS, openRewardId]);

  // Handle confirm redeem
  const handleConfirmRedeem = useCallback(async () => {
    if (!activeReward || !studentId) {
      toast.error("Không thể đổi quà. Vui lòng thử lại sau.");
      return;
    }

    if (!activeReward.inStock) {
      toast.error("Sản phẩm đã hết hàng.");
      return;
    }

    if (quantity < 1) {
      toast.error("Số lượng phải lớn hơn 0.");
      return;
    }

    if (quantity > activeReward.stock) {
      toast.error(`Số lượng vượt quá tồn kho. Hiện còn ${activeReward.stock} sản phẩm.`);
      return;
    }

    const totalPoints = activeReward.points * quantity;
    if (userPoints < totalPoints) {
      toast.error(`Bạn cần ${totalPoints.toLocaleString("vi-VN")} điểm để đổi ${quantity} sản phẩm này. Hiện tại bạn có ${userPoints.toLocaleString("vi-VN")} điểm.`);
      return;
    }

    try {
      // Đảm bảo studentId đã được lấy từ API /me
      if (!studentId) {
        toast.error("Không tìm thấy thông tin student. Vui lòng tải lại trang.");
        return;
      }

      // Tạo payload theo đúng format JSON yêu cầu
      // studentId được lấy từ API /me (endpoint: GET /me)
      // productId được lấy từ id của API /products (endpoint: GET /products)
      const invoicePayload = {
        studentId: studentId, // ID từ API /me
        productId: activeReward.id, // ID từ API /products (product.id)
        quantity: quantity,
      };

      const result = await createNewInvoice(invoicePayload);

      if (result.success) {
        // Lấy product data từ response
        // Response có thể chứa product data trực tiếp hoặc trong nested object
        const responseData = result.data;
        let productData: RedeemedProduct | null = null;
        
        // Kiểm tra các format response có thể có
        if (responseData) {
          // Format 1: Product data trực tiếp trong response
          if (responseData.id && responseData.title) {
            productData = {
              id: responseData.id,
              type: responseData.type,
              title: responseData.title,
              description: responseData.description,
              unitCost: responseData.unitCost,
              currency: responseData.currency,
              totalStock: responseData.totalStock,
              imageUrl: responseData.imageUrl,
              isActive: responseData.isActive,
              createdAt: responseData.createdAt,
            };
          }
          // Format 2: Product data trong nested object (product field)
          else if (responseData.product) {
            productData = {
              id: responseData.product.id,
              type: responseData.product.type,
              title: responseData.product.title,
              description: responseData.product.description,
              unitCost: responseData.product.unitCost,
              currency: responseData.product.currency,
              totalStock: responseData.product.totalStock,
              imageUrl: responseData.product.imageUrl,
              isActive: responseData.product.isActive,
              createdAt: responseData.product.createdAt,
            };
          }
        }
        
        // Nếu không tìm thấy product data trong response, sử dụng activeReward
        if (!productData && activeReward) {
          productData = {
            id: activeReward.id,
            type: activeReward.category === "voucher" ? "VOUCHER" : "GIFT",
            title: activeReward.name,
            description: activeReward.description,
            unitCost: activeReward.points,
            currency: "COIN",
            totalStock: activeReward.stock,
            imageUrl: activeReward.image,
            isActive: activeReward.inStock,
            createdAt: activeReward.createdAt,
          };
        }
        
        // Hiển thị dialog với thông tin sản phẩm
        if (productData) {
          setRedeemedProduct(productData);
          setShowSuccessDialog(true);
        }
        
        setOpenRewardId(null); // Đóng dialog đổi quà
        // Refresh data
        await Promise.all([
          loadUserPoints(),
          loadProducts(),
        ]);
      } else {
        // Lấy error message từ result hoặc Redux state
        let errorMessage = "Đổi quà thất bại. Vui lòng thử lại.";
        
        // Ưu tiên error từ result
        if (result.error) {
          if (typeof result.error === "string") {
            errorMessage = result.error;
          } else if (result.error?.message) {
            errorMessage = result.error.message;
          } else if (result.error?.response?.data?.message) {
            errorMessage = result.error.response.data.message;
          } else if (typeof result.error === "object") {
            errorMessage = JSON.stringify(result.error);
          }
        } else if (invoiceError) {
          // Fallback: Error từ Redux state
          if (typeof invoiceError === "string") {
            errorMessage = invoiceError;
          } else if (typeof invoiceError === "object" && invoiceError !== null) {
            const errorObj = invoiceError as any;
            if (errorObj.message) {
              errorMessage = errorObj.message;
            } else {
              errorMessage = JSON.stringify(invoiceError);
            }
          }
        }
        
        toast.error(errorMessage);
      }
    } catch (error: any) {
      let errorMessage = "Đổi quà thất bại. Vui lòng thử lại.";
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  }, [activeReward, studentId, userPoints, quantity, createNewInvoice, loadUserPoints, loadProducts, invoiceError]);

  const similarRewards = useMemo(() => {
    if (!activeReward) return [] as Reward[];
    return ALL_REWARDS.filter((r) => r.category === activeReward.category && r.id !== activeReward.id).slice(0, 3);
  }, [ALL_REWARDS, activeReward]);

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Search & Filter */}
      <GiftsSearchFilter
        query={query}
        onQueryChange={(q) => {
          setQuery(q);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(s) => {
          setSortBy(s);
          setCurrentPage(1);
        }}
        pointsFilter={pointsFilter}
        onPointsFilterChange={(f) => {
          setPointsFilter(f);
          setCurrentPage(1);
        }}
        selectedCategories={selectedCategories}
        onCategoryToggle={toggleCategory}
        onSelectAll={handleSelectAll}
        isAllSelected={isAllSelected}
      />

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
              {current.map((r, index) => (
                <GiftCard
                  key={r.id}
                  reward={r}
                  index={index}
                  userPoints={userPoints}
                  isTopProduct={topProductIds.has(r.id)}
                  isLowStock={r.stock < 50}
                  onOpenDetails={openDetails}
                />
              ))}
            </div>
          ) : !loadingProducts && ALL_REWARDS.length === 0 ? (
            <div className="text-center py-16 text-gray-500">Không có quà nào</div>
          ) : !loadingProducts ? (
            <div className="text-center py-16 text-gray-500">Không tìm thấy quà phù hợp</div>
          ) : null}

          {/* Pagination */}
          <GiftsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* Reward Details Modal */}
      <GiftDetailDialog
        reward={activeReward}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={closeDetails}
        onConfirmRedeem={handleConfirmRedeem}
        creatingInvoice={creatingInvoice}
        studentId={studentId}
        similarRewards={similarRewards}
        onOpenSimilar={openDetails}
      />

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        product={redeemedProduct}
      />
    </main>
  );
}
