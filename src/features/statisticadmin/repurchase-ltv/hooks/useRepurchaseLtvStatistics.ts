"use client";

import { useEffect, useMemo, useState } from "react";
import { getRepurchaseLtvData } from "@/features/services/adminRepurchaseLtvStatistics.service";
import { ApiRequestError } from "@/lib/api";
import { RepurchaseLtvStatistics } from "../types";
import { getRepurchaseLtvDateRange, RepurchaseLtvPeriod } from "../utils";

export const useRepurchaseLtvStatistics = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<RepurchaseLtvPeriod>("THIS_MONTH");
  const [data, setData] = useState<RepurchaseLtvStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => getRepurchaseLtvDateRange(selectedPeriod),
    [selectedPeriod]
  );

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getRepurchaseLtvData(query, controller.signal);

        if (controller.signal.aborted) return;
        setData(result);
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setData(null);
        setError(
          loadError instanceof ApiRequestError
            ? loadError.message
            : "재구매·LTV 현황을 불러오지 못했습니다."
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

  return {
    selectedPeriod,
    setSelectedPeriod,
    query,
    data,
    isLoading,
    error,
  };
};
