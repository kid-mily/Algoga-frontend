"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CountryProfitData,
  getCountryProfitData,
} from "@/features/services/adminCountryProfitStatistics.service";
import { ApiRequestError } from "@/lib/api";
import {
  CountryProfitPeriod,
  getCountryProfitDateRange,
} from "../utils";

export const useCountryProfitStatistics = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<CountryProfitPeriod>("THIS_MONTH");
  const [data, setData] = useState<CountryProfitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => getCountryProfitDateRange(selectedPeriod),
    [selectedPeriod]
  );

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getCountryProfitData(query, controller.signal);

        if (controller.signal.aborted) return;
        setData(result);
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setData(null);
        setError(
          loadError instanceof ApiRequestError
            ? loadError.message
            : "나라별 수익성 현황을 불러오지 못했습니다."
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
