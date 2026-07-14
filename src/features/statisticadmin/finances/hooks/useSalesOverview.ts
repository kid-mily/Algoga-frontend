"use client";

import { useEffect, useMemo, useState } from "react";
import { getSalesOverview } from "@/features/services/adminSalesOverview.service";
import { ApiRequestError } from "@/lib/api";
import {
  SalesOverview,
  SalesOverviewPeriod,
} from "../types";
import { getSalesOverviewDateRange } from "../utils/salesOverviewFormatters";

export const useSalesOverview = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<SalesOverviewPeriod>("thisMonth");
  const [overview, setOverview] = useState<SalesOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => getSalesOverviewDateRange(selectedPeriod),
    [selectedPeriod]
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadOverview = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getSalesOverview(query, controller.signal);
        setOverview(data);
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setOverview(null);
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
  }, [query]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    overview,
    isLoading,
    error,
  };
};
