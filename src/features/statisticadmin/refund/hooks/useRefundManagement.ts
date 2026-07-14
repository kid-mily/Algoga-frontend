"use client";

import { useEffect, useMemo, useState } from "react";
import { getRefundManagementData } from "@/features/services/adminRefundStatistics.service";
import { ApiRequestError } from "@/lib/api";
import { RefundManagementData, RefundPeriod } from "../types";
import { getRefundDateRange, getTrendUnit } from "../utils";

export const useRefundManagement = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<RefundPeriod>("thisMonth");
  const [data, setData] = useState<RefundManagementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => getRefundDateRange(selectedPeriod),
    [selectedPeriod]
  );
  const trendUnit = useMemo(() => getTrendUnit(selectedPeriod), [selectedPeriod]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getRefundManagementData(
          query,
          trendUnit,
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
            : "환불 관리 현황을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => controller.abort();
  }, [query, trendUnit]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    trendUnit,
    data,
    isLoading,
    error,
  };
};
