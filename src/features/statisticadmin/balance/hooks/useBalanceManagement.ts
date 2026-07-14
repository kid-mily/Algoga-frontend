"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  downloadUnpaidBookingsCsv,
  getBalanceManagementData,
} from "@/features/services/adminBalanceStatistics.service";
import { ApiRequestError } from "@/lib/api";
import { BalanceManagementData, BalancePeriod } from "../types";
import { getBalanceDateRange } from "../utils";

export const useBalanceManagement = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<BalancePeriod>("thisMonth");
  const [data, setData] = useState<BalanceManagementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => getBalanceDateRange(selectedPeriod),
    [selectedPeriod]
  );

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getBalanceManagementData(
          query,
          controller.signal
        );

        if (controller.signal.aborted) return;
        setData(result);
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setData(null);
        setError(
          loadError instanceof ApiRequestError
            ? loadError.message
            : "잔금 관리 현황을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => controller.abort();
  }, [query]);

  const downloadCsv = useCallback(async () => {
    await downloadUnpaidBookingsCsv(query);
  }, [query]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    data,
    isLoading,
    error,
    downloadCsv,
  };
};
