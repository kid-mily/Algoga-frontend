import { useEffect, useMemo, useState } from "react";
import { getMonthlyRevenueStats } from "@/features/services/adminRevenue.service";
import { MonthlyRevenueStat } from "../types";
import { formatRevenueError } from "../utils";

export const useRevenueStats = () => {
  const [stats, setStats] = useState<MonthlyRevenueStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getMonthlyRevenueStats(controller.signal);

        if (controller.signal.aborted) return;
        setStats(data);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;
        setError(formatRevenueError(loadError, "월별 수익 통계를 불러오지 못했습니다."));
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

  const latestStat = useMemo(
    () =>
      stats.reduce<MonthlyRevenueStat | undefined>((latest, stat) => {
        if (!latest) return stat;

        const latestValue = latest.year * 12 + latest.month;
        const statValue = stat.year * 12 + stat.month;

        return statValue > latestValue ? stat : latest;
      }, undefined),
    [stats]
  );
  const totalNetAmount = useMemo(
    () => stats.reduce((sum, stat) => sum + stat.netAmount, 0),
    [stats]
  );

  return {
    stats,
    latestStat,
    totalNetAmount,
    isLoading,
    error,
  };
};
