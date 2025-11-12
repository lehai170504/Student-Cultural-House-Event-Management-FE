import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product, ProductListResponse } from "../types/product";
import {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  // 1. Cập nhật Imports: Thêm hai thunk mới
  fetchTopRedeemedProducts,
  fetchLowStockProducts,
} from "../thunks/productThunks";

// 2. Cập nhật Interface ProductState: Thêm state cho Top/Low Stock
interface ProductState {
  list: Product[];
  loadingList: boolean;
  saving: boolean;
  pagination: ProductListResponse["metadata"] | null;
  error: string | null;

  detail: Product | null;
  loadingDetail: boolean;

  // Trạng thái cho Top Redeemed Products
  topRedeemed: Product[];
  loadingTopRedeemed: boolean;

  // Trạng thái cho Low Stock Products
  lowStock: Product[];
  loadingLowStock: boolean;
}

const initialState: ProductState = {
  list: [],
  loadingList: false,
  saving: false,
  pagination: null,
  error: null,
  detail: null,
  loadingDetail: false,

  // Khởi tạo trạng thái mới
  topRedeemed: [],
  loadingTopRedeemed: false,
  lowStock: [],
  loadingLowStock: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    /** 🔹 Reset danh sách */
    resetList: (state) => {
      state.list = [];
      state.pagination = null;
    },
    /** 🔹 Reset chi tiết */
    resetDetail: (state) => {
      state.detail = null;
    },
    /** 🔹 Xóa lỗi */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /** 🔸 FETCH ALL PRODUCTS (Giữ nguyên) */
      .addCase(fetchAllProducts.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(
        fetchAllProducts.fulfilled,
        (state, action: PayloadAction<ProductListResponse>) => {
          state.loadingList = false;
          state.list = action.payload.data || [];
          state.pagination = action.payload.metadata || null;
        }
      )
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loadingList = false;
        state.error =
          (action.payload as string) || "Không thể tải danh sách sản phẩm.";
      })

      // ... (Các case FETCH BY ID, CREATE, UPDATE, DELETE giữ nguyên)

      /** 🔸 FETCH PRODUCT BY ID (Giữ nguyên) */
      .addCase(fetchProductById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loadingDetail = false;
          state.detail = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.detail = null;
        state.error =
          (action.payload as string) || "Không thể tải chi tiết sản phẩm.";
      })

      /** 🔸 CREATE PRODUCT (Giữ nguyên) */
      .addCase(createProduct.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) state.list.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || "Không thể tạo sản phẩm.";
      })

      /** 🔸 UPDATE PRODUCT (Giữ nguyên) */
      .addCase(updateProduct.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        const index = state.list.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          state.list[index] = updated;
        }
        if (state.detail && state.detail.id === updated.id) {
          state.detail = updated;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.saving = false;
        state.error =
          (action.payload as string) || "Không thể cập nhật sản phẩm.";
      })

      /** 🔸 DELETE PRODUCT (Giữ nguyên) */
      .addCase(deleteProduct.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.saving = false;
        // ✅ Xóa khỏi danh sách nếu có ID trong meta.arg
        const id = (action.meta.arg as string) ?? null;
        if (id) {
          state.list = state.list.filter((p) => p.id !== id);
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || "Không thể xóa sản phẩm.";
      })

      // 3. Bổ sung extraReducers cho Top Redeemed

      /** 🏆 FETCH TOP REDEEMED PRODUCTS */
      .addCase(fetchTopRedeemedProducts.pending, (state) => {
        state.loadingTopRedeemed = true;
        state.error = null;
      })
      .addCase(
        fetchTopRedeemedProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loadingTopRedeemed = false;
          state.topRedeemed = action.payload || [];
        }
      )
      .addCase(fetchTopRedeemedProducts.rejected, (state, action) => {
        state.loadingTopRedeemed = false;
        state.topRedeemed = [];
        state.error =
          (action.payload as string) || "Không thể tải sản phẩm nổi bật.";
      })

      // Bổ sung extraReducers cho Low Stock

      /** 📉 FETCH LOW STOCK PRODUCTS */
      .addCase(fetchLowStockProducts.pending, (state) => {
        state.loadingLowStock = true;
        state.error = null;
      })
      .addCase(
        fetchLowStockProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loadingLowStock = false;
          state.lowStock = action.payload || [];
        }
      )
      .addCase(fetchLowStockProducts.rejected, (state, action) => {
        state.loadingLowStock = false;
        state.lowStock = [];
        state.error =
          (action.payload as string) || "Không thể tải sản phẩm tồn kho thấp.";
      });
  },
});

export const { resetList, resetDetail, clearError } = productSlice.actions;
export default productSlice.reducer;
