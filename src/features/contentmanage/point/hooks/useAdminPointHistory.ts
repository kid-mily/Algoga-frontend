"use client";

import { useEffect, useState } from "react";
import { getPointHistory } from "@/features/services/adminPoint.service";
import { PointHistory } from "../types";
import { getErrorMessage, isAbortError } from "../utils/errorUtils";

const DEFAULT_PAGE_SIZE = 10;

export const useAdminPointHistory = (studentId: number) => {
  const [logs, setLogs] = useState<PointHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getPointHistory(
          studentId,
          { page: Math.max(currentPage - 1, 0), size: DEFAULT_PAGE_SIZE },
          abortController.signal
        );
        if (abortController.signal.aborted) return;
        setLogs(data.histories);
        setTotalPages(Math.max(data.totalPages, 1));
        setIsLoading(false);
      } catch (fetchError: unknown) {
        if (isAbortError(fetchError) || abortController.signal.aborted) return;
        setError(getErrorMessage(fetchError, "상세 내역을 불러오지 못했습니다."));
        setIsLoading(false);
      }
    };

    const handleInvalidStudentId = async () => {
      setLogs([]);
      setError("유효하지 않은 학생 ID입니다.");
      setIsLoading(false);
    };

    if (abortController.signal.aborted) return;

    if (Number.isFinite(studentId) && studentId > 0) {
      void fetchHistory();
    } else {
      void handleInvalidStudentId();
    }

    return () => {
      abortController.abort();
    };
  }, [studentId, currentPage]);

  return {
    logs,
    currentPage,
    totalPages,
    isLoading,
    error,
    setCurrentPage,
  };
};
