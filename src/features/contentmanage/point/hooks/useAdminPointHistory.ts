"use client";

import { useEffect, useState } from "react";
import { getPointHistory } from "@/features/services/adminPoint.service";
import { PointHistory } from "../types";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useAdminPointHistory = (studentId: number) => {
  const [logs, setLogs] = useState<PointHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getPointHistory(studentId);
        setLogs(data);
      } catch (fetchError: unknown) {
        setError(getErrorMessage(fetchError, "상세 내역을 불러오지 못했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchHistory();
    }
  }, [studentId]);

  return {
    logs,
    isLoading,
    error,
  };
};
