"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getStudentsPoints,
  givePoints,
  recallPoints,
} from "@/features/services/adminPoint.service";
import { PointPayload, StudentPointInfo } from "../types";
import { getErrorMessage, isAbortError } from "../utils/errorUtils";

const DEFAULT_PAGE_SIZE = 10;

export const useAdminPointList = () => {
  const [students, setStudents] = useState<StudentPointInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const mutationFetchControllerRef = useRef<AbortController | null>(null);

  const fetchStudents = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getStudentsPoints(
          { page: Math.max(currentPage - 1, 0), size: DEFAULT_PAGE_SIZE },
          signal
        );
        if (signal?.aborted) return;
        setStudents(data.students);
        setTotalPages(Math.max(data.totalPages, 1));
        setTotalElements(data.totalElements);
        setIsLoading(false);
      } catch (fetchError: unknown) {
        if (isAbortError(fetchError) || signal?.aborted) return;
        setError(getErrorMessage(fetchError, "학생 마일리지 정보를 불러오지 못했습니다."));
        setIsLoading(false);
      }
    },
    [currentPage]
  );

  const giveStudentPoints = useCallback(
    async (payload: PointPayload) => {
      mutationFetchControllerRef.current?.abort();
      const controller = new AbortController();
      mutationFetchControllerRef.current = controller;

      try {
        setError("");
        await givePoints(payload);
        await fetchStudents(controller.signal);
        return true;
      } catch (submitError: unknown) {
        if (isAbortError(submitError) || controller.signal.aborted) return false;
        setError(getErrorMessage(submitError, "마일리지 지급에 실패했습니다."));
        return false;
      } finally {
        if (mutationFetchControllerRef.current === controller) {
          mutationFetchControllerRef.current = null;
        }
      }
    },
    [fetchStudents]
  );

  const recallStudentPoints = useCallback(
    async (payload: PointPayload) => {
      mutationFetchControllerRef.current?.abort();
      const controller = new AbortController();
      mutationFetchControllerRef.current = controller;

      try {
        setError("");
        await recallPoints(payload);
        await fetchStudents(controller.signal);
        return true;
      } catch (submitError: unknown) {
        if (isAbortError(submitError) || controller.signal.aborted) return false;
        setError(getErrorMessage(submitError, "마일리지 회수에 실패했습니다."));
        return false;
      } finally {
        if (mutationFetchControllerRef.current === controller) {
          mutationFetchControllerRef.current = null;
        }
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
      mutationFetchControllerRef.current?.abort();
    };
  }, [fetchStudents]);

  return {
    students,
    currentPage,
    totalPages,
    totalElements,
    isLoading,
    error,
    setCurrentPage,
    refetch: fetchStudents,
    giveStudentPoints,
    recallStudentPoints,
  };
};
