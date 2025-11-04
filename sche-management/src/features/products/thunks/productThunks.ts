import { createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../services/productService";
import type {
  Product,
  CreateProduct,
  UpdateProduct,
  ProductListResponse,
} from "../types/product";
import type { FetchProductsParams } from "../services/productService";

/** 🔹 Lấy danh sách sản phẩm (có filter/sort/pagination) */
export const fetchAllProducts = createAsyncThunk<
  ProductListResponse,
  FetchProductsParams | undefined
>("product/fetchAll", async (params, { rejectWithValue }) => {
  try {
    // 🔸 Đảm bảo params luôn có giá trị mặc định
    const defaultParams: FetchProductsParams = {
      category: params?.category,
      minCost: params?.minCost,
      maxCost: params?.maxCost,
      sortBy: params?.sortBy ?? "popularity",
      order: params?.order ?? "desc",
      isActive: params?.isActive ?? true,
      limit: params?.limit ?? 10,
      offset: params?.offset ?? 0,
    };

    const response = await productService.getAll(defaultParams);
    return response;
  } catch (error: any) {
    console.error("❌ [fetchAllProducts] Error:", error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

/** 🔹 Lấy chi tiết sản phẩm theo ID */
export const fetchProductById = createAsyncThunk<Product, number>(
  "product/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getById(id);
      return response;
    } catch (error: any) {
      console.error(`❌ [fetchProductById] Error for id=${id}:`, error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- CÁC HÀM MỚI BỔ SUNG ---

/** 🏆 Lấy sản phẩm được redeem nhiều nhất (GET /api/v1/products/top) */
export const fetchTopRedeemedProducts = createAsyncThunk<Product[]>(
  "product/fetchTopRedeemed",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getTopRedeemed();
      return response;
    } catch (error: any) {
      console.error("❌ [fetchTopRedeemedProducts] Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/** 📉 Lấy sản phẩm tồn kho thấp (GET /api/v1/products/low-stock) */
export const fetchLowStockProducts = createAsyncThunk<Product[]>(
  "product/fetchLowStock",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getLowStock();
      return response;
    } catch (error: any) {
      console.error("❌ [fetchLowStockProducts] Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- CÁC HÀM QUẢN TRỊ (ADMIN) ---

/** 🔹 Tạo mới sản phẩm */
export const createProduct = createAsyncThunk<Product, CreateProduct>(
  "product/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await productService.create(data);
      return response;
    } catch (error: any) {
      console.error("❌ [createProduct] Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/** 🔹 Cập nhật sản phẩm */
export const updateProduct = createAsyncThunk<
  Product,
  { id: number; data: UpdateProduct }
>("product/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await productService.update(id, data);
    return response;
  } catch (error: any) {
    console.error(`❌ [updateProduct] Error for id=${id}:`, error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

/** 🔹 Xoá mềm sản phẩm */
export const deleteProduct = createAsyncThunk<{ success: boolean }, number>(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.softDelete(id);
      return response;
    } catch (error: any) {
      console.error(`❌ [deleteProduct] Error for id=${id}:`, error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
