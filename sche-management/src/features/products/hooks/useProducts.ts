"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchTopRedeemedProducts,
  fetchLowStockProducts,
} from "../thunks/productThunks";
import { clearError, resetList, resetDetail } from "../slices/productSlice";
import type { CreateProduct, UpdateProduct } from "../types/product";
import type { FetchProductsParams } from "../services/productService";

export const useProducts = () => {
  const dispatch = useAppDispatch();

  const {
    list,
    pagination,
    loadingList,
    saving,
    error,
    detail,
    loadingDetail,
    topRedeemed,
    loadingTopRedeemed,
    lowStock,
    loadingLowStock,
  } = useAppSelector((state) => state.product);

  /** 🔹 Fetch tất cả sản phẩm */
  const loadAll = useCallback(
    async (params?: FetchProductsParams) => {
      const res: any = await dispatch(
        fetchAllProducts(params ?? undefined)
      ).unwrap();

      if (Array.isArray(res)) {
        res.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
          return dateB - dateA; // mới nhất lên đầu
        });
      }

      return res;
    },
    [dispatch]
  );

  /** 🏆 Fetch sản phẩm được redeem nhiều nhất */
  const loadTopRedeemed = useCallback(async () => {
    await dispatch(fetchTopRedeemedProducts());
  }, [dispatch]);

  /** 📉 Fetch sản phẩm tồn kho thấp */
  const loadLowStock = useCallback(async () => {
    await dispatch(fetchLowStockProducts());
  }, [dispatch]);

  /** 🔹 Fetch chi tiết sản phẩm */
  const loadDetail = useCallback(
    async (id: number) => {
      await dispatch(fetchProductById(id));
    },
    [dispatch]
  );

  /** 🔹 Tạo mới sản phẩm */
  const createNewProduct = useCallback(
    async (data: CreateProduct): Promise<boolean> => {
      const result = await dispatch(createProduct(data));
      return createProduct.fulfilled.match(result);
    },
    [dispatch]
  );

  /** 🔹 Cập nhật sản phẩm */
  const editProduct = useCallback(
    async (id: number, data: UpdateProduct): Promise<boolean> => {
      const result = await dispatch(updateProduct({ id, data }));
      return updateProduct.fulfilled.match(result);
    },
    [dispatch]
  );

  /** 🔹 Xóa sản phẩm */
  const removeProduct = useCallback(
    async (id: number): Promise<boolean> => {
      const result = await dispatch(deleteProduct(id));
      return deleteProduct.fulfilled.match(result);
    },
    [dispatch]
  );

  /** 🔹 Reset danh sách */
  const reset = useCallback(() => {
    dispatch(resetList());
  }, [dispatch]);

  /** 🔹 Reset chi tiết */
  const resetProductDetail = useCallback(() => {
    dispatch(resetDetail());
  }, [dispatch]);

  /** 🔹 Xóa lỗi */
  const clearProductError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔹 Tự động load sản phẩm khi mount */
  useEffect(() => {
    loadAll();
    // loadTopRedeemed(); // Có thể thêm nếu muốn tự động tải
  }, [loadAll]);

  return {
    list,
    pagination,
    loadingList,
    saving,
    error,
    detail,
    loadingDetail,
    topRedeemed,
    loadingTopRedeemed,
    lowStock,
    loadingLowStock,
    loadAll,
    loadDetail,
    loadTopRedeemed,
    loadLowStock,
    createNewProduct,
    editProduct,
    removeProduct,
    reset,
    resetProductDetail,
    clearProductError,
  };
};
