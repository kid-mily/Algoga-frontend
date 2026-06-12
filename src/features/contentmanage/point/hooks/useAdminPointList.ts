"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getStudentsPoints,
  givePoints,
  recallPoints,
} from "@/features/services/adminPoint.service";
import { PointPayload, StudentPointInfo } from "../types";
import { getErrorMessage, isAbortError } from "../utils/errorUtils";

export const useAdminPointList = () => {
  const [students, setStudents] = useState<StudentPointInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getStudentsPoints(signal);
      if (signal?.aborted) return;
      setStudents(data);
    } catch (fetchError: unknown) {
      if (isAbortError(fetchError) || signal?.aborted) return;
      setError(getErrorMessage(fetchError, "학생 마일리지 정보를 불러오지 못했습니다."));
    } finally {
      if (signal?.aborted) return;
      setIsLoading(false);
    }
  }, []);

  const giveStudentPoints = useCallback(
    async (payload: PointPayload) => {
      try {
        setError("");
        await givePoints(payload);
        await fetchStudents();
        return true;
      } catch (submitError: unknown) {
        setError(getErrorMessage(submitError, "마일리지 지급에 실패했습니다."));
        return false;
      }
    },
    [fetchStudents]
  );

  const recallStudentPoints = useCallback(
    async (payload: PointPayload) => {
      try {
        setError("");
        await recallPoints(payload);
        await fetchStudents();
        return true;
      } catch (submitError: unknown) {
        setError(getErrorMessage(submitError, "마일리지 회수에 실패했습니다."));
        return false;
      }
    },
    [fetchStudents]
  );

  useEffect(() => {
    const abortController = new AbortController();

    void Promise.resolve().then(() => {
      if (!abortController.signal.aborted) {
        void fetchStudents(abortController.signal);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [fetchStudents]);

  return {
    students,
    isLoading,
    error,
    refetch: fetchStudents,
    giveStudentPoints,
    recallStudentPoints,
  };
};
