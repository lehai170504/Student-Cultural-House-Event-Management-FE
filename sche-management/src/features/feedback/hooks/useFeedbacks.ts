"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllFeedbacks } from "../thunks/feedbackThunks";
import { clearError, setFilterEventId } from "../slices/feedbackSlice";
import type { PaginationParams } from "@/utils/apiResponse";

export const useFeedbacks = () => {
  const dispatch = useAppDispatch();

  const { list, loadingList, pagination, error, filterEventId } =
    useAppSelector((state) => state.feedback);

  const [localEventId, setLocalEventId] = useState<string | undefined>(
    filterEventId
  );

  /** 🔸 Lấy tất cả feedback, có hỗ trợ filter theo eventId */
  const loadAll = useCallback(
    async (params?: PaginationParams & { eventId?: string }) => {
      const queryParams = {
        ...params,
        eventId: localEventId,
      };
      const res: any = await dispatch(fetchAllFeedbacks(queryParams)).unwrap();
      return res;
    },
    [dispatch, localEventId]
  );

  /** 🔸 Thiết lập filter eventId */
  const setEventFilter = useCallback(
    (eventId?: string) => {
      setLocalEventId(eventId);
      dispatch(setFilterEventId(eventId));
      loadAll({ page: 1, size: 10 });
    },
    [dispatch, loadAll]
  );

  /** 🔸 Xoá lỗi */
  const clearFeedbackError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔸 Tự động load danh sách khi mount */
  useEffect(() => {
    loadAll({ page: 1, size: 10 });
  }, [loadAll]);

  return {
    list,
    loadingList,
    pagination,
    error,
    filterEventId: localEventId,
    loadAll,
    setEventFilter,
    clearFeedbackError,
  };
};
