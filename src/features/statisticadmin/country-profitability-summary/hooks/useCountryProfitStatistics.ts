"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CountryProfitData,
  getCountryProfitItems,
  getCountryProfitSummary,
} from "@/features/services/adminCountryProfitStatistics.service";
import { ApiRequestError } from "@/lib/api";
import type { CountryProfitabilityItem } from "../types";
import {
  CountryProfitPeriod,
  getCountryProfitDateRange,
} from "../utils";

export const useCountryProfitStatistics = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<CountryProfitPeriod>("THIS_MONTH");
  const [search, setSearch] = useState("");
  // 요약·차트는 기간 전체 기준(검색 무관), 표 목록만 검색으로 걸러집니다.
  const [base, setBase] = useState<CountryProfitData | null>(null);
  const [tableItems, setTableItems] = useState<CountryProfitabilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(
    () => getCountryProfitDateRange(selectedPeriod),
    [selectedPeriod]
  );

  // 요약 카드 + 차트용 전체 목록 (기간에만 의존).
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [summary, items] = await Promise.all([
          getCountryProfitSummary(query, controller.signal),
          getCountryProfitItems(query, controller.signal),
        ]);

        if (controller.signal.aborted) return;
        setBase({ summary, items });
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setBase(null);
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

  // 표 목록은 기간 + 서버 검색(국가명)에 의존 — 입력을 300ms 디바운스합니다.
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsTableLoading(true);

        const items = await getCountryProfitItems(
          { ...query, search },
          controller.signal
        );

        if (controller.signal.aborted) return;
        setTableItems(items);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setTableItems([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsTableLoading(false);
        }
      }
    };

    const timeoutId = window.setTimeout(() => {
      void load();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, search]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    search,
    setSearch,
    query,
    data: base,
    tableItems,
    isLoading,
    isTableLoading,
    error,
  };
};
