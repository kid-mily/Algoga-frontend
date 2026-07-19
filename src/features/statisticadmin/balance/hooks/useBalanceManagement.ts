"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  downloadUnpaidBookingsCsv,
  getBalanceAging,
  getBalanceSummary,
  getUnpaidBookings,
} from "@/features/services/adminBalanceStatistics.service";
import { ApiRequestError } from "@/lib/api";
import {
  BalanceManagementData,
  BalancePeriod,
  OutstandingReservation,
} from "../types";
import { getBalanceDateRange } from "../utils";

// 요약·잔금 곡선·나라별 전환율은 검색과 무관하고, 미납 목록만 서버 검색 대상입니다.
type BalanceBaseData = Omit<BalanceManagementData, "outstandingReservations">;

export const useBalanceManagement = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<BalancePeriod>("thisMonth");
  const [search, setSearch] = useState("");
  const [base, setBase] = useState<BalanceBaseData | null>(null);
  const [outstandingReservations, setOutstandingReservations] = useState<
    OutstandingReservation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnpaidLoading, setIsUnpaidLoading] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(
    () => getBalanceDateRange(selectedPeriod),
    [selectedPeriod]
  );

  // 요약 지표와 차트는 기간에만 의존 — 검색어가 바뀌어도 다시 부르지 않습니다.
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [summary, aging] = await Promise.all([
          getBalanceSummary(query, controller.signal),
          getBalanceAging(query, controller.signal),
        ]);

        if (controller.signal.aborted) return;
        setBase({
          summary,
          recoveryRates: aging.recoveryRates,
          countryConversions: aging.countryConversions,
        });
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setBase(null);
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

  // 미납 예약 목록은 기간 + 서버 검색(고객명·상품명)에 의존 — 입력을 300ms 디바운스합니다.
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsUnpaidLoading(true);

        const list = await getUnpaidBookings(
          { ...query, search },
          controller.signal
        );

        if (controller.signal.aborted) return;
        setOutstandingReservations(list);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setOutstandingReservations([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsUnpaidLoading(false);
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

  const data = useMemo<BalanceManagementData | null>(
    () => (base ? { ...base, outstandingReservations } : null),
    [base, outstandingReservations]
  );

  const downloadCsv = useCallback(
    () => downloadUnpaidBookingsCsv({ ...query, search }),
    [query, search]
  );

  return {
    selectedPeriod,
    setSelectedPeriod,
    search,
    setSearch,
    data,
    isLoading,
    isUnpaidLoading,
    error,
    downloadCsv,
  };
};
