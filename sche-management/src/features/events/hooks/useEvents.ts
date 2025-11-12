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
} from "../thunks/eventThunks";
import { resetDetail, clearError, resetPagination } from "../slices/eventSlice";
import { fetchAllEventCategories } from "@/features/eventCategories/thunks/eventCategoryThunks";

import type {
  CreateEvent,
  UpdateEvent,
  EventCheckinDetail,
  EventCheckinRequest,
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
    currentPage,
    totalElements,
    totalPages,
    pageSize,
    isLastPage,

    registering,
    sendingFeedback,
    checkingIn,
    loadingAttendees,
    attendees,
    finalizing,
    submittingCheckin,
  } = useAppSelector((state) => state.event);

  const { list: categories = [], loadingList: loadingCategories } =
    useAppSelector((state) => state.eventCategory);

  const loadAll = useCallback(
    async (params?: Record<string, any>) => {
      const validParams =
        params && Object.keys(params).length > 0 ? params : undefined;
      const res = await dispatch(fetchAllEvents(validParams)).unwrap();
      if (Array.isArray(res)) {
        res.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.eventDate).getTime();
          const dateB = new Date(b.createdAt || b.eventDate).getTime();
          return dateB - dateA;
        });
      }

      return res;
    },
    [dispatch]
  );

  const loadDetail = useCallback(
    async (id: number) => {
      await dispatch(fetchEventById(id));
    },
    [dispatch]
  );

  const createNewEvent = useCallback(
    async (data: CreateEvent) => {
      const result = await dispatch(createEvent(data));
      return result;
    },
    [dispatch]
  );

  const updateExistingEvent = useCallback(
    async (id: number, data: UpdateEvent) => {
      const result = await dispatch(updateEvent({ id, data }));
      return result;
    },
    [dispatch]
  );

  const deleteEventById = useCallback(
    async (id: number) => {
      const result = await dispatch(deleteEvent(id));
      return result;
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
    await dispatch(fetchAllEventCategories());
  }, [dispatch]);

  const registerForEventByStudent = useCallback(
    async (eventId: number, studentId: number) => {
      const result = await dispatch(registerForEvent({ eventId, studentId }));
      return result;
    },
    [dispatch]
  );

  const sendFeedbackForEvent = useCallback(
    async (eventId: number, data: { rating: number; comments: string }) => {
      const result = await dispatch(sendEventFeedback({ eventId, data }));
      return result;
    },
    [dispatch]
  );

  const checkinForEvent = useCallback(
    async (data: { eventId: number; phoneNumber: string }) => {
      const result = await dispatch(checkinEvent(data));
      return result;
    },
    [dispatch]
  );

  const loadEventAttendees = useCallback(
    async (eventId: number, params?: Record<string, any>) => {
      const result = await dispatch(fetchEventAttendees({ eventId, params }));
      return result;
    },
    [dispatch]
  );

  const finalizeEventById = useCallback(
    async (eventId: number) => {
      const result = await dispatch(finalizeEvent(eventId));
      return result;
    },
    [dispatch]
  );

  const submitCheckinDetailData = useCallback(
    async (data: EventCheckinDetail) => {
      const checkinPayload = {
        eventId: data.eventId,
        phoneNumber: (data as any).phoneNumber,
      };

      // Gọi thunk checkinEvent
      const result = await dispatch(checkinEvent(checkinPayload));
      return result;
    },
    [dispatch]
  );
  useEffect(() => {
    loadAll({ page: 1, size: 10 }).catch((err) => {
      console.log("Could not load events:", err);
    });
    dispatch(fetchAllEventCategories())
      .unwrap()
      .catch((err: any) => {
        console.log("Could not load categories:", err);
      });
  }, [loadAll, dispatch]);

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

    currentPage,
    totalElements,
    totalPages,
    pageSize,
    isLastPage,

    loadAll,
    loadDetail,
    createNewEvent,
    updateExistingEvent,
    deleteEventById,
    resetEventDetail,
    resetEventPagination,
    clearEventError,

    registerForEventByStudent,
    sendFeedbackForEvent,
    checkinForEvent,
    loadEventAttendees,
    finalizeEventById,
    submitCheckinDetailData,
  };
};
