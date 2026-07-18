"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSalesOverview,
  getSalesOverviewTrend,
} from "@/features/services/adminSalesOverview.service";
import { ApiRequestError } from "@/lib/api";
import {
  SalesOverview,
  SalesOverviewPeriod,
  SalesTrendPoint,
} from "../types";
import {
  getSalesOverviewDateRange,
  getSalesTrendUnit,
} from "../utils/salesOverviewFormatters";

export const useSalesOverview = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<SalesOverviewPeriod>("thisMonth");
  const [overview, setOverview] = useState<SalesOverview | null>(null);
  const [trend, setTrend] = useState<SalesTrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => getSalesOverviewDateRange(selectedPeriod),
    [selectedPeriod]
  );
  const trendUnit = useMemo(
    () => getSalesTrendUnit(selectedPeriod),
    [selectedPeriod]
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadOverview = async () => {
      setIsLoading(true);
      setError("");

      try {
        // 카드·표용 overview와 차트용 trend를 동시에 불러옵니다.
        const [overviewData, trendData] = await Promise.all([
          getSalesOverview(query, controller.signal),
          getSalesOverviewTrend(query, trendUnit, controller.signal),
        ]);

        setOverview(overviewData);
        setTrend(trendData);
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setOverview(null);
        setTrend([]);
        setError(
          loadError instanceof ApiRequestError
            ? loadError.message
            : "재무 현황을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadOverview();

    return () => controller.abort();
  }, [query, trendUnit]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    overview,
    trend,
    isLoading,
    error,
  };
};
