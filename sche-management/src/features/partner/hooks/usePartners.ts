"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllPartners,
  createPartner,
  updatePartnerStatus,
  fetchPartnerById,
  fetchPartnerEvents,
  fetchPartnerWallet,
  fetchPartnerWalletHistory,
  fundEventByPartner,
  broadcastByPartner,
} from "../thunks/partnerThunks";
import { clearError } from "../slices/partnerSlice";
import type { CreatePartner } from "@/features/partner/types/partner";

export const usePartners = () => {
  const dispatch = useAppDispatch();

  const {
    list,
    loadingList,
    saving,
    error,
    partnerDetail,
    loadingDetail,
    wallet,
    transactions,
    loadingWallet,
    loadingTransactions,
    events,
    loadingEvents,
    lastMessage,
  } = useAppSelector((state) => state.partner);

  /** 🔸 Lấy danh sách tất cả partner */
  const loadAll = useCallback(async () => {
    const res: any = await dispatch(fetchAllPartners()).unwrap();
    if (Array.isArray(res)) {
      res.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
        return dateB - dateA;
      });
    }
    return res;
  }, [dispatch]);

  /** 🔸 Tạo mới partner */
  const createNewPartner = useCallback(
    async (data: CreatePartner) => {
      const result = await dispatch(createPartner(data)).unwrap();
      return result;
    },
    [dispatch]
  );

  /** 🔸 Cập nhật trạng thái partner */
  const changePartnerStatus = useCallback(
    async (id: string, status: "ACTIVE" | "INACTIVE") => {
      const result = await dispatch(
        updatePartnerStatus({ id, status })
      ).unwrap();
      return result;
    },
    [dispatch]
  );

  /** 🔸 Lấy partner theo id */
  const loadPartnerById = useCallback(
    async (id: string | number) => {
      const result = await dispatch(fetchPartnerById(id)).unwrap();
      return result;
    },
    [dispatch]
  );

  /** 🔸 Lấy wallet của partner */
  const loadPartnerWallet = useCallback(
    async (partnerId: string | number) => {
      const result = await dispatch(fetchPartnerWallet(partnerId)).unwrap();
      return result;
    },
    [dispatch]
  );

  /** 🔸 Lấy lịch sử wallet */
  const loadPartnerWalletHistory = useCallback(
    async (partnerId: string | number, params?: Record<string, any>) => {
      const result = await dispatch(
        fetchPartnerWalletHistory({ partnerId, params })
      ).unwrap();
      return result;
    },
    [dispatch]
  );

  /** 🔸 Lấy danh sách sự kiện partner */
  const loadPartnerEvents = useCallback(
    async (partnerId: string | number, params?: Record<string, any>) => {
      const result = await dispatch(
        fetchPartnerEvents({ partnerId, params })
      ).unwrap();
      return result;
    },
    [dispatch]
  );

  /** 🔸 Nạp quỹ cho sự kiện */
  const fundEvent = useCallback(
    async (
      partnerId: string | number,
      eventId: string | number,
      amount: number | string
    ) => {
      const result = await dispatch(
        fundEventByPartner({ partnerId, eventId, amount })
      ).unwrap();
      return result;
    },
    [dispatch]
  );

  /** 🔸 Gửi broadcast thông báo */
  const broadcast = useCallback(
    async (partnerId: string | number, payload: Record<string, any>) => {
      const result = await dispatch(
        broadcastByPartner({ partnerId, payload })
      ).unwrap();
      return result;
    },
    [dispatch]
  );

  /** 🔸 Xoá lỗi */
  const clearPartnerError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔸 Tự động load danh sách khi mount */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    list,
    error,
    loadingList,
    saving,
    partnerDetail,
    loadingDetail,
    wallet,
    transactions,
    loadingWallet,
    loadingTransactions,
    events,
    loadingEvents,
    lastMessage,
    loadAll,
    createNewPartner,
    changePartnerStatus,
    loadPartnerById,
    loadPartnerWallet,
    loadPartnerWalletHistory,
    loadPartnerEvents,
    fundEvent,
    broadcast,
    clearPartnerError,
  };
};
