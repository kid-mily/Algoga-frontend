import { useEffect, useMemo, useState } from "react";
import { getAdminCouponStatistics } from "@/features/services/adminCouponStatistics.service";
import { CouponStatistic, CouponStatisticsSummary } from "../types";
import { formatCouponStatisticsError } from "../utils";

const emptySummary: CouponStatisticsSummary = {
  filterCourseId: null,
  filterCountryId: null,
  totalPolicyCount: 0,
  totalIssuedCount: 0,
  totalUsedCount: 0,
  totalExpiredCount: 0,
  totalAvailableCount: 0,
  averageUsageRate: 0,
};

export const useCouponStatistics = () => {
  const [summary, setSummary] = useState<CouponStatisticsSummary>(emptySummary);
  const [statistics, setStatistics] = useState<CouponStatistic[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getAdminCouponStatistics(controller.signal);

        if (controller.signal.aborted) return;
        setSummary(data.summary);
        setStatistics(data.statistics);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;
        setError(
          formatCouponStatisticsError(
            loadError,
            "쿠폰 통계를 불러오지 못했습니다."
          )
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredStatistics = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return statistics;

    return statistics.filter((statistic) =>
      [
        statistic.couponName,
        statistic.courseName,
        statistic.countryName,
        String(statistic.couponPolicyId),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [searchKeyword, statistics]);

  return {
    summary,
    statistics,
    filteredStatistics,
    searchKeyword,
    isLoading,
    error,
    setSearchKeyword,
  };
};
