import { useState, useCallback, useEffect } from "react";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product";
import { studentService } from "@/features/students/services/studentService";
import axiosInstance from "@/config/axiosInstance";

export function useGiftsData() {
  // User points from wallet
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(true);
  
  // Student ID for invoice
  const [studentId, setStudentId] = useState<string | null>(null);
  
  // Products from API
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Top selling products (bán chạy)
  const [topProductIds, setTopProductIds] = useState<Set<string>>(new Set());
  const [loadingTopProducts, setLoadingTopProducts] = useState<boolean>(false);

  // Load user wallet balance and student ID từ API /me
  const loadUserPoints = useCallback(async () => {
    try {
      setLoadingPoints(true);
      // Gọi API /me để lấy thông tin profile của student hiện tại
      const profile = await studentService.getProfile();
      
      // Lưu studentId từ API /me để dùng cho invoice (convert to string)
      if (profile?.id) {
        setStudentId(String(profile.id));
      } else {
        setStudentId(null);
      }
      
      // Lấy walletId - có thể là number, string, hoặc null
      const walletId = profile?.walletId;
      
      // Nếu walletId không có trong profile, thử gọi API /me trực tiếp để xem raw response
      if (!walletId) {
        try {
          const meResponse = await axiosInstance.get<any>("/me");
          const meData = meResponse?.data?.data ?? meResponse?.data ?? {};
          
          // Thử lấy walletId từ raw response
          const rawWalletId = meData?.walletId;
          if (rawWalletId) {
            // Sử dụng rawWalletId
            const walletIdStr = String(rawWalletId);
            const walletResponse = await axiosInstance.get<any>(`/wallets/${walletIdStr}`);
            const walletData = walletResponse?.data?.data ?? walletResponse?.data ?? {};
            const balance = Number(walletData?.balance ?? 0);
            setUserPoints(balance);
            return; // Return early nếu đã load được
          }
        } catch (rawError: any) {
          // Silent error handling
        }
      }

      // Sử dụng walletId trực tiếp như string hoặc number (giống card page)
      if (walletId !== null && walletId !== undefined) {
        // Convert walletId sang string để dùng trong URL
        const walletIdStr = String(walletId);
        
        // Gọi API trực tiếp giống như card page để đảm bảo format đúng
        const walletResponse = await axiosInstance.get<any>(`/wallets/${walletIdStr}`);
        const walletData = walletResponse?.data?.data ?? walletResponse?.data ?? {};
        
        // Parse balance giống như card page
        const balance = Number(walletData?.balance ?? 0);
        
        if (isNaN(balance) || balance < 0) {
          setUserPoints(0);
        } else {
          setUserPoints(balance);
        }
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

  // Load top selling products
  const loadTopProducts = useCallback(async () => {
    try {
      setLoadingTopProducts(true);
      const topProducts = await productService.getTopRedeemed();
      // API /products/top trả về format: [{ productId, totalRedeem, title, totalCoins }]
      // Lưu danh sách productIds của sản phẩm phổ biến
      const topIds = new Set(topProducts.map((p) => p.productId));
      setTopProductIds(topIds);
    } catch (e: any) {
      setTopProductIds(new Set());
    } finally {
      setLoadingTopProducts(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadUserPoints();
    loadProducts();
    loadTopProducts();
  }, [loadUserPoints, loadProducts, loadTopProducts]);

  return {
    userPoints,
    loadingPoints,
    studentId,
    products,
    loadingProducts,
    error,
    topProductIds,
    loadingTopProducts,
    loadUserPoints,
    loadProducts,
    loadTopProducts,
  };
}

