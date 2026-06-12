"use client";

import { useEffect, useState } from "react";
import { getPointHistory } from "@/features/services/adminPoint.service";
import { PointHistory } from "../types";
import { getErrorMessage, isAbortError } from "../utils/errorUtils";

export const useAdminPointHistory = (studentId: number) => {
  const [logs, setLogs] = useState<PointHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getPointHistory(studentId, abortController.signal);
        if (abortController.signal.aborted) return;
        setLogs(data);
      } catch (fetchError: unknown) {
        if (isAbortError(fetchError) || abortController.signal.aborted) return;
        setError(getErrorMessage(fetchError, "상세 내역을 불러오지 못했습니다."));
      } finally {
        if (abortController.signal.aborted) return;
        setIsLoading(false);
      }
    };

    void Promise.resolve().then(() => {
      if (abortController.signal.aborted) return;

      if (Number.isFinite(studentId) && studentId > 0) {
        void fetchHistory();
        return;
      }

      setLogs([]);
      setError("유효하지 않은 학생 ID입니다.");
      setIsLoading(false);
    });

    return () => {
      abortController.abort();
    };
  }, [studentId]);

  return {
    logs,
    isLoading,
    error,
  };
};
