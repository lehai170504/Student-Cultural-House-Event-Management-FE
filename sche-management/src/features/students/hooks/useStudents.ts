"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchStudents, updateStudentStatus } from "../thunks/studentThunks";
import { clearError, resetList } from "../slices/studentSlice";
import type { FetchUniversityUsersParams } from "../services/studentService";

export const useUniversityUsers = () => {
  const dispatch = useAppDispatch();

  const { list, loadingList, loadingStatus, error } = useAppSelector(
    (state) => state.student
  );

  /** 🔸 Fetch all university users with parameters */
  const loadAll = useCallback(
    async (params?: FetchUniversityUsersParams) => {
      const res: any = await dispatch(
        fetchStudents(params ?? undefined)
      ).unwrap();
      if (Array.isArray(res)) {
        res.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
          return dateB - dateA;
        });
      }

      return res;
    },
    [dispatch]
  );

  /** 🔸 Update status (ACTIVE/INACTIVE) of a student */
  const changeStudentStatus = useCallback(
    async (id: number, status: "ACTIVE" | "INACTIVE"): Promise<boolean> => {
      try {
        const result = await dispatch(updateStudentStatus({ id, status }));
        return updateStudentStatus.fulfilled.match(result);
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  /** 🔸 Reset the student list */
  const reset = useCallback(() => {
    dispatch(resetList());
  }, [dispatch]);

  /** 🔸 Clear any university error */
  const clearUniversityError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔸 Automatically load the list on mount */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    list,
    loadingList,
    loadingStatus,
    error,
    loadAll,
    changeStudentStatus,
    reset,
    clearUniversityError,
  };
};
