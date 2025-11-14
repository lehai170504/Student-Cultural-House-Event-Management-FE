import axiosInstance from "@/config/axiosInstance";
import type {
  Product,
  UpdateProduct,
  ProductListResponse,
  CreateProductData,
  ProductOverviewAnalytics,
  RedeemStatistics,
} from "../types/product";

/** Endpoint gốc cho module Product */
const endpoint = "/products";

/** Tham số filter/sort/pagination khi lấy danh sách sản phẩm */
export interface FetchProductsParams {
  category?: string; // GIFT, VOUCHER, MERCH, SERVICE
  minCost?: number;
  maxCost?: number;
  sortBy?: "popularity" | "cost" | "createdAt" | "stock";
  order?: "asc" | "desc";
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export const productService = {
  /** 🔹 Lấy danh sách sản phẩm (có sort/filter/pagination) */
  async getAll(params?: FetchProductsParams): Promise<ProductListResponse> {
    try {
      const queryParams: Record<string, any> = {
        category: params?.category,
        minCost: params?.minCost,
        maxCost: params?.maxCost,
        sortBy: params?.sortBy ?? "popularity",
        order: params?.order ?? "desc",
        isActive: params?.isActive ?? true,
        limit: params?.limit ?? 10,
        offset: params?.offset ?? 0,
      };

      const res = await axiosInstance.get<any>(endpoint, {
        params: queryParams,
      });
      const responseData = res.data;

      // Nếu BE trả về { data, metadata }
      if (responseData?.data && responseData?.metadata) {
        return responseData as ProductListResponse;
      }

      // Fallback: giả sử BE trả về trực tiếp mảng
      return {
        data: Array.isArray(responseData) ? responseData : [],
        metadata: {
          page: 0,
          totalItems: responseData.length ?? 0,
          pageSize: responseData.length ?? 10,
        },
      };
    } catch (error) {
      console.error("❌ [getAll] Error fetching products:", error);
      throw error;
    }
  },

  /** 🔹 Lấy chi tiết sản phẩm theo ID */
  async getById(id: string): Promise<Product> {
    try {
      const res = await axiosInstance.get<any>(`${endpoint}/${id}`);
      const apiData = res?.data?.data ?? res?.data;
      return apiData as Product;
    } catch (error) {
      console.error(`❌ [getById] Error fetching product id=${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Tạo mới sản phẩm (Admin) */
  async create(
    productData: CreateProductData,
    imageFile: File | null
  ): Promise<Product> {
    try {
      const formData = new FormData();
      const dataJsonString = JSON.stringify(productData);
      formData.append("data", dataJsonString);
      if (imageFile) {
        formData.append("image", imageFile, imageFile.name);
      } else {
      }

      const res = await axiosInstance.post<any>(endpoint, formData);

      const apiData = res?.data?.data ?? res?.data;
      return apiData as Product;
    } catch (error) {
      console.error("❌ [create] Error creating product:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật thông tin sản phẩm (Admin) */
  async update(
    id: string,
    productData: UpdateProduct,
    imageFile: File | null
  ): Promise<Product> {
    try {
      const formData = new FormData();
      const dataJsonString = JSON.stringify(productData);
      formData.append("data", dataJsonString);

      if (imageFile) {
        formData.append("image", imageFile, imageFile.name);
      }

      const res = await axiosInstance.put<any>(`${endpoint}/${id}`, formData);

      const apiData = res?.data?.data ?? res?.data;
      return apiData as Product;
    } catch (error) {
      console.error(`❌ [update] Error updating product id=${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Xoá mềm sản phẩm (Admin) */
  async softDelete(id: string): Promise<{ success: boolean }> {
    try {
      const res = await axiosInstance.delete<any>(`${endpoint}/${id}`);
      const apiData = res?.data?.data ?? res?.data;
      return apiData ?? { success: true };
    } catch (error) {
      console.error(`❌ [softDelete] Error deleting product id=${id}:`, error);
      throw error;
    }
  },

  async getTopRedeemed(): Promise<Product[]> {
    try {
      // Gọi API mà không truyền object 'params'
      const res = await axiosInstance.get<Product[]>(`${endpoint}/top`);

      return res.data;
    } catch (error) {
      console.error("❌ [getTopRedeemed] Error fetching top products:", error);
      throw error;
    }
  },

  async getLowStock(): Promise<Product[]> {
    try {
      // Gọi API mà không truyền object 'params'
      const res = await axiosInstance.get<Product[]>(`${endpoint}/low-stock`);

      return res.data;
    } catch (error) {
      console.error(
        "❌ [getLowStock] Error fetching low stock products:",
        error
      );
      throw error;
    }
  },

  async getOverviewAnalytics(): Promise<ProductOverviewAnalytics> {
    try {
      const res = await axiosInstance.get<ProductOverviewAnalytics>(
        `/admin${endpoint}/overview`
      );
      return res.data;
    } catch (error) {
      console.error(
        "❌ [getOverviewAnalytics] Error fetching overview:",
        error
      );
      throw error;
    }
  },

  async getRedeemStatistics(): Promise<RedeemStatistics> {
    try {
      // Endpoint này nằm trong module 'invoices'
      const res = await axiosInstance.get<RedeemStatistics>(`/invoices/stats`);
      return res.data;
    } catch (error) {
      console.error(
        "❌ [getRedeemStatistics] Error fetching redeem stats:",
        error
      );
      throw error;
    }
  },
};
