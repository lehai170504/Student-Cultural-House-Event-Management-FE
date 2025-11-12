"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  sendEventFeedback,
  checkinEvent,
  fetchEventAttendees,
  finalizeEvent,
  checkinByPhoneNumber,
  approveEvent,
} from "../thunks/eventThunks";
import { resetDetail, clearError, resetPagination } from "../slices/eventSlice";
import { fetchAllEventCategories } from "@/features/eventCategories/thunks/eventCategoryThunks";
import type {
  CreateEvent,
  UpdateEvent,
  EventCheckinDetail,
} from "../types/events";

export const useEvents = () => {
  const dispatch = useAppDispatch();

  const {
    list,
    detail,
    loadingList,
    loadingDetail,
    saving,
    deleting,
    error,
    pagination,
    registering,
    sendingFeedback,
    checkingIn,
    loadingAttendees,
    attendees,
    finalizing,
    submittingCheckin,
    approving,
  } = useAppSelector((state) => state.event);

  const { list: categories = [], loadingList: loadingCategories } =
    useAppSelector((state) => state.eventCategory);

  const loadAll = useCallback(
    async (params?: Record<string, any>) => {
      const res = await dispatch(fetchAllEvents(params)).unwrap();

      if (res?.data && Array.isArray(res.data)) {
        return res.data
          .filter((item) => item?.createdAt)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }

      return [];
    },
    [dispatch]
  );

  const loadDetail = useCallback(
    async (id: string) => {
      return await dispatch(fetchEventById(id)).unwrap();
    },
    [dispatch]
  );

  const createNewEvent = useCallback(
    async (data: CreateEvent) => {
      return await dispatch(createEvent(data)).unwrap();
    },
    [dispatch]
  );

  const updateExistingEvent = useCallback(
    async (id: string, data: UpdateEvent) => {
      return await dispatch(updateEvent({ id, data })).unwrap();
    },
    [dispatch]
  );

  const deleteEventById = useCallback(
    async (id: string) => {
      return await dispatch(deleteEvent(id)).unwrap();
    },
    [dispatch]
  );

  const resetEventDetail = useCallback(() => {
    dispatch(resetDetail());
  }, [dispatch]);

  const resetEventPagination = useCallback(() => {
    dispatch(resetPagination());
  }, [dispatch]);

  const clearEventError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const loadCategories = useCallback(async () => {
    await dispatch(fetchAllEventCategories()).unwrap();
  }, [dispatch]);

  const registerForEventByStudent = useCallback(
    async (eventId: string, studentId: string) => {
      return await dispatch(registerForEvent({ eventId, studentId })).unwrap();
    },
    [dispatch]
  );

  const sendFeedbackForEvent = useCallback(
    async (eventId: string, data: { rating: number; comments: string }) => {
      return await dispatch(sendEventFeedback({ eventId, data })).unwrap();
    },
    [dispatch]
  );

  const checkinForEvent = useCallback(
    async (data: { eventId: string; phoneNumber: string }) => {
      return await dispatch(checkinEvent(data)).unwrap();
    },
    [dispatch]
  );

  const loadEventAttendees = useCallback(
    async (eventId: string, params?: Record<string, any>) => {
      return await dispatch(fetchEventAttendees({ eventId, params })).unwrap();
    },
    [dispatch]
  );

  const finalizeEventById = useCallback(
    async (eventId: string) => {
      return await dispatch(finalizeEvent(eventId)).unwrap();
    },
    [dispatch]
  );

  const approveEventById = useCallback(
    async (eventId: string) => {
      return await dispatch(approveEvent(eventId)).unwrap();
    },
    [dispatch]
  );

  const submitCheckinDetailData = useCallback(
    async (data: EventCheckinDetail & { phoneNumber: string }) => {
      const checkinPayload = {
        eventId: data.eventId,
        data: { phoneNumber: data.phoneNumber },
      };
      return await dispatch(checkinByPhoneNumber(checkinPayload)).unwrap();
    },
    [dispatch]
  );

  useEffect(() => {
    loadAll({ page: 1, size: 10 }).catch(console.error);
    loadCategories().catch(console.error);
  }, [loadAll, loadCategories]);

  return {
    list,
    detail,
    attendees,
    error,
    eventCategories: categories,

    loadingList,
    loadingDetail,
    saving,
    deleting,
    loadingCategories,
    registering,
    sendingFeedback,
    checkingIn,
    loadingAttendees,
    finalizing,
    submittingCheckin,
    approving,

    pagination,

    loadAll,
    loadDetail,
    createNewEvent,
    updateExistingEvent,
    deleteEventById,
    resetEventDetail,
    resetEventPagination,
    clearEventError,
    loadCategories,
    registerForEventByStudent,
    sendFeedbackForEvent,
    checkinForEvent,
    loadEventAttendees,
    finalizeEventById,
    approveEventById,
    submitCheckinDetailData,
  };
};
